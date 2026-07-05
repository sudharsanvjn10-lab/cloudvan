const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const JWT_SECRET = process.env.JWT_SECRET || 'cvs-super-secret-key-12345';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied: No token provided' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied: Invalid token format' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Access denied: Invalid or expired session' });
  }
}

app.use(cors()); 
app.use(express.json());

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('?ssl-mode=REQUIRED', '') : undefined,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`\n📧 [EMAIL MOCK SENT]
To: ${to}
Subject: ${subject}
Content: ${html.replace(/<[^>]*>/g, ' ')}\n`);
    return;
  }
  try {
    await transporter.sendMail({
      from: `"Cloud Vantage Solutions" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[SMTP SUCCESS] Sent email to ${to}`);
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${to}:`, error.message);
  }
}

app.get('/api/insights', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM insights ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team_members');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching team:", error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// POST: Secure Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (isPasswordMatch) {
        const token = jwt.sign(
          { email: user.email, privilege: user.privilege },
          JWT_SECRET,
          { expiresIn: '12h' }
        );
        res.json({ token, email: user.email, privilege: user.privilege });
      } else {
        res.status(401).json({ error: 'Invalid corporate credentials' });
      }
    } else {
      res.status(401).json({ error: 'Invalid corporate credentials' });
    }
  } catch (error) {
    console.error("Login verification error:", error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// POST: Contact Form Submit
app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, message } = req.body;
  try {
    await pool.query(
      'INSERT INTO contact_messages (name, company, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [name, company, email, phone, message]
    );

    // Send confirmation email to user
    sendEmail({
      to: email,
      subject: 'Query Received - Cloud Vantage Solutions',
      html: `<p>Dear ${name},</p><p>Thank you for contacting us. We have received your query regarding <strong>${company || 'your business'}</strong>. Our team will get back to you shortly.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
    });

    // Send alert notification email to admin
    sendEmail({
      to: 'sudharsanvjn10@gmail.com',
      subject: 'Alert: New Contact Inquiry Received',
      html: `<h3>New Inward Contact Message</h3>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Company:</strong> ${company || 'N/A'}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error storing contact message:", error);
    res.status(500).json({ error: 'Failed to submit query' });
  }
});

// POST: Newsletter Subscribe
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  try {
    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);

    // Send confirmation email to user
    sendEmail({
      to: email,
      subject: 'Newsletter Subscription Confirmed - Cloud Vantage Solutions',
      html: `<p>Hello,</p><p>Thank you for subscribing to the Cloud Vantage Solutions newsletter. You will receive updates about Oracle Cloud insights and enterprise industry trends.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
    });

    // Send alert notification email to admin
    sendEmail({
      to: 'sudharsanvjn10@gmail.com',
      subject: 'Alert: New Newsletter Subscriber',
      html: `<p>A new email address has subscribed to the Cloud Vantage Solutions newsletter:</p>
             <p><strong>Subscriber Email:</strong> ${email}</p>`
    });

    res.json({ success: true });
  } catch (error) {
    // If user already subscribed, ignore error or return success
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    console.error("Subscription error:", error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST: Job Application Submit
app.post('/api/apply', async (req, res) => {
  const { name, email, resumeLink, jobTitle } = req.body;
  try {
    await pool.query(
      'INSERT INTO job_applications (name, email, resume_link, job_title) VALUES (?, ?, ?, ?)',
      [name, email, resumeLink, jobTitle]
    );

    // Send confirmation email to applicant
    sendEmail({
      to: email,
      subject: 'Application Received - Cloud Vantage Solutions',
      html: `<p>Dear ${name},</p><p>Thank you for applying for the position of <strong>${jobTitle}</strong> at Cloud Vantage Solutions. We have received your profile and resume. Our hiring team will review your application and reach out if your background matches our requirements.</p><br><p>Best regards,<br>HR Recruiting Team<br>Cloud Vantage Solutions</p>`
    });

    // Send alert notification email to admin
    sendEmail({
      to: 'sudharsanvjn10@gmail.com',
      subject: `Alert: New Candidate Application - ${jobTitle}`,
      html: `<h3>New Job Application Profile</h3>
             <p><strong>Applicant Name:</strong> ${name}</p>
             <p><strong>Position Applied:</strong> ${jobTitle}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Resume Link:</strong> <a href="${resumeLink}">${resumeLink}</a></p>`
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving job application:", error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// POST: Create Admin User (Secured)
app.post('/api/admin/create-user', authenticateToken, async (req, res) => {
  const { email, password, privilege } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query('INSERT INTO users (email, password, privilege) VALUES (?, ?, ?)', [email, hashedPassword, privilege]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Failed to create corporate admin account' });
  }
});

// POST: Change Password (Secured)
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// GET: Admin Dashboard Data (Secured)
app.get('/api/admin/data', authenticateToken, async (req, res) => {
  try {
    const [contacts] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const [subscribers] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
    const [applications] = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC');
    const [users] = await pool.query('SELECT id, email, privilege FROM users');
    res.json({ contacts, subscribers, applications, users });
  } catch (error) {
    console.error("Admin data query error:", error);
    res.status(500).json({ error: 'Failed to query admin records' });
  }
});

// DELETE: Delete Job Application (Secured)
app.delete('/api/admin/application/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM job_applications WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting job application:", error);
    res.status(500).json({ error: 'Failed to delete application record' });
  }
});

// DELETE: Delete Contact Message (Secured)
app.delete('/api/admin/contact/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({ error: 'Failed to delete contact record' });
  }
});

// DELETE: Delete Newsletter Subscriber (Secured)
app.delete('/api/admin/subscriber/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM newsletter_subscribers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting newsletter subscriber:", error);
    res.status(500).json({ error: 'Failed to delete subscriber record' });
  }
});

// DELETE: Delete Admin User (Secured)
app.delete('/api/admin/user/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete admin user account' });
  }
});

// POST: Record and increment page visit count
app.post('/api/visits', async (req, res) => {
  try {
    await pool.query('UPDATE visitor_stats SET count = count + 1 WHERE id = 1');
    const [rows] = await pool.query('SELECT count FROM visitor_stats WHERE id = 1');
    res.json({ count: rows[0] ? rows[0].count : 0 });
  } catch (error) {
    console.error("Error updating visits:", error);
    res.status(500).json({ error: 'Failed to record visit' });
  }
});

// GET: Fetch current page visit count
app.get('/api/visits', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT count FROM visitor_stats WHERE id = 1');
    res.json({ count: rows[0] ? rows[0].count : 0 });
  } catch (error) {
    console.error("Error fetching visits:", error);
    res.status(500).json({ error: 'Failed to fetch visit count' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Online', 
    service: 'Cloud Vantage Solutions Dedicated API', 
    database: 'MySQL Configured',
    timestamp: new Date() 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cloud Vantage Solutions API running on port ${PORT}`);
  console.log(`Waiting for live production requests...`);
});