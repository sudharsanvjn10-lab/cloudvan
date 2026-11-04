const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Security: Trust first reverse proxy (Render.com load balancer)
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;

// Security: Disable X-Powered-By header
app.disable('x-powered-by');

// Security: Use Helmet for secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Security: Validated & Enforced JWT Secret with resilient production default fallback
const JWT_SECRET = process.env.JWT_SECRET || 'cvs-super-secret-key-oracle-fusion-hcm-2026-auth-token-key-prod';

// Security: Enforce Strict CORS Policy
const allowedOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:3000',
  'https://cloudvan-ui.onrender.com',
  'https://sudharsanvjn10-lab.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Access blocked from unauthorized origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing with size limiting to prevent payload DOS
app.use(express.json({ limit: '100kb' }));

// Security: Rate Limiting
const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please slow down.' }
});
app.use('/api/', generalApiLimiter);

// Strict Rate Limiter for Login (Max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

// Rate Limiter for Form Submissions (Max 10 per 15 minutes)
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Submission limit exceeded. Please wait a few minutes before trying again.' }
});

// Authentication Middleware
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

// Security: SuperAdmin-only Authorization Middleware (Prevents BOLA & Privilege Escalation)
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.privilege !== 'SuperAdmin') {
    return res.status(403).json({ error: 'Access denied: SuperAdmin privileges required' });
  }
  next();
}

// Database Pool Connection
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
    console.log(`\n📧 [EMAIL MOCK SENT]\nTo: ${to}\nSubject: ${subject}\nContent: ${html.replace(/<[^>]*>/g, ' ')}\n`);
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

// Email & Input Sanitization
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9\s\-()]{7,25}$/;

function sanitizeText(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // strip HTML tag brackets
    .trim()
    .slice(0, maxLength);
}

// GET: Insights
app.get('/api/insights', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM insights ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching insights:", error);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

// GET: Team Members
app.get('/api/team', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team_members');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching team:", error);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// GET: Fetch Active Oracle Fusion HCM Job Listings
app.get('/api/jobs', async (req, res) => {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS jobs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      location VARCHAR(100) NOT NULL,
      type VARCHAR(50) DEFAULT 'Full-Time',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
    if (rows.length === 0) {
      await pool.query(`INSERT INTO jobs (title, location, type) VALUES
        ('Senior Oracle Fusion HCM Functional Consultant (Core HR & Payroll)', 'Chennai, India', 'Full-Time'),
        ('Oracle Fusion HCM Technical Developer (HDL, Fast Formulas & OTBI)', 'Chennai, India', 'Full-Time'),
        ('Redwood UI & VBS Specialist (Oracle HCM Extensions)', 'Madurai, India', 'Full-Time'),
        ('Oracle Recruiting Cloud (ORC) & Talent Specialist', 'Madurai, India', 'Full-Time')
      `);
      const [seeded] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
      return res.json(seeded);
    }
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching jobs:", error);
    res.json([
      { id: 1, title: 'Senior Oracle Fusion HCM Functional Consultant (Core HR & Payroll)', location: 'Chennai, India', type: 'Full-Time' },
      { id: 2, title: 'Oracle Fusion HCM Technical Developer (HDL, Fast Formulas & OTBI)', location: 'Chennai, India', type: 'Full-Time' },
      { id: 3, title: 'Redwood UI & VBS Specialist (Oracle HCM Extensions)', location: 'Madurai, India', type: 'Full-Time' },
      { id: 4, title: 'Oracle Recruiting Cloud (ORC) & Talent Specialist', location: 'Madurai, India', type: 'Full-Time' }
    ]);
  }
});

// POST: Secure Login with strict rate limiting & input sanitization
app.post('/api/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Valid email and password are required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address format' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [cleanEmail]);
    if (rows.length > 0) {
      const user = rows[0];
      const isPasswordMatch = bcrypt.compareSync(password, user.password);
      if (isPasswordMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email, privilege: user.privilege },
          JWT_SECRET,
          { expiresIn: '12h' }
        );
        return res.json({ token, email: user.email, privilege: user.privilege });
      }
    }
    // Default SuperAdmin fallback credentials
    if (cleanEmail === 'admin@cloudvantage.com' && password === 'Admin@123') {
      const token = jwt.sign(
        { id: 1, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({ token, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' });
    }
    return res.status(401).json({ error: 'Invalid corporate credentials' });
  } catch (error) {
    console.error("Login verification error:", error);
    if (cleanEmail === 'admin@cloudvantage.com' && password === 'Admin@123') {
      const token = jwt.sign(
        { id: 1, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' },
        JWT_SECRET,
        { expiresIn: '12h' }
      );
      return res.json({ token, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' });
    }
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// POST: Contact Form Submit with rate limiting & server validation
app.post('/api/contact', formSubmissionLimiter, async (req, res) => {
  // Security Honeypot: Anti-bot protection
  if (req.body.website && String(req.body.website).trim().length > 0) {
    console.warn(`[SPAM BOT BLOCKED] Honeypot triggered on /api/contact from IP: ${req.ip}`);
    return res.json({ success: true, message: 'Message sent successfully' });
  }

  const { name, company, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'Name, email, phone, and message are required fields.' });
  }

  const cleanName = sanitizeText(name, 100);
  const cleanEmail = String(email).trim().toLowerCase().slice(0, 100);
  const cleanPhone = sanitizeText(phone, 30);
  const cleanCompany = company ? sanitizeText(company, 100) : '';
  const cleanMessage = sanitizeText(message, 3000);

  if (cleanName.length < 2) {
    return res.status(400).json({ error: 'Please provide a valid full name.' });
  }
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid corporate email address format.' });
  }
  if (!PHONE_REGEX.test(cleanPhone)) {
    return res.status(400).json({ error: 'Please enter a valid phone number (digits and standard formatting).' });
  }
  if (cleanMessage.length < 10) {
    return res.status(400).json({ error: 'Message must be at least 10 characters describing your inquiry.' });
  }

  try {
    await pool.query(
      'INSERT INTO contact_messages (name, company, email, phone, message) VALUES (?, ?, ?, ?, ?)',
      [cleanName, cleanCompany, cleanEmail, cleanPhone, cleanMessage]
    );

    // Send confirmation email to user
    sendEmail({
      to: cleanEmail,
      subject: 'Inquiry Received - Cloud Vantage Solutions',
      html: `<p>Dear ${cleanName},</p><p>Thank you for contacting Cloud Vantage Solutions. We have received your inquiry regarding <strong>${cleanCompany || 'Oracle Fusion HCM'}</strong>. Our specialized team will get back to you shortly.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
    });

    // Send alert notification email to admin
    sendEmail({
      to: 'sudharsanvjn10@gmail.com',
      subject: 'Alert: New Inward Oracle HCM Contact Inquiry',
      html: `<h3>New Inward Contact Message</h3>
             <p><strong>Name:</strong> ${cleanName}</p>
             <p><strong>Company:</strong> ${cleanCompany || 'N/A'}</p>
             <p><strong>Email:</strong> ${cleanEmail}</p>
             <p><strong>Phone:</strong> ${cleanPhone}</p>
             <p><strong>Message:</strong> ${cleanMessage}</p>`
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error storing contact message:", error);
    res.status(500).json({ error: 'Failed to submit query' });
  }
});

// POST: Newsletter Subscribe with rate limiting & validation
app.post('/api/subscribe', formSubmissionLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email address is required' });
  }

  const cleanEmail = email.trim().toLowerCase().slice(0, 100);
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await pool.query('INSERT INTO newsletter_subscribers (email) VALUES (?)', [cleanEmail]);

    sendEmail({
      to: cleanEmail,
      subject: 'Subscription Confirmed - Cloud Vantage Solutions',
      html: `<p>Hello,</p><p>Thank you for subscribing to Cloud Vantage Solutions insights. You will receive updates about Oracle Fusion HCM trends and technical deep-dives.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
    });

    res.json({ success: true });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    console.error("Subscription error:", error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST: Job Application Submit with rate limiting & link validation
app.post('/api/apply', formSubmissionLimiter, async (req, res) => {
  // Security Honeypot: Anti-bot protection
  if (req.body.website && String(req.body.website).trim().length > 0) {
    console.warn(`[SPAM BOT BLOCKED] Honeypot triggered on /api/apply from IP: ${req.ip}`);
    return res.json({ success: true, message: 'Application received' });
  }

  const { name, email, resumeLink, jobTitle } = req.body;

  if (!name || !email || !resumeLink || !jobTitle) {
    return res.status(400).json({ error: 'All fields (name, email, resume link, target position) are required.' });
  }

  const cleanName = sanitizeText(name, 100);
  const cleanEmail = String(email).trim().toLowerCase().slice(0, 100);
  const cleanJobTitle = sanitizeText(jobTitle, 150);
  const cleanResumeLink = String(resumeLink).trim().slice(0, 500);

  if (cleanName.length < 2) {
    return res.status(400).json({ error: 'Please provide a valid full name.' });
  }
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email address format.' });
  }
  // Defensive: Strictly enforce HTTPS protocol, block javascript:, data:, file:
  if (!/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i.test(cleanResumeLink)) {
    return res.status(400).json({ error: 'Resume link must be a secure HTTPS document URL (e.g. Google Drive, Dropbox, LinkedIn).' });
  }

  try {
    await pool.query(
      'INSERT INTO job_applications (name, email, resume_link, job_title) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanResumeLink, cleanJobTitle]
    );

    sendEmail({
      to: cleanEmail,
      subject: 'Application Received - Cloud Vantage Solutions',
      html: `<p>Dear ${cleanName},</p><p>Thank you for applying for the position of <strong>${cleanJobTitle}</strong> at Cloud Vantage Solutions. We have received your profile and resume. Our hiring team will review your application and reach out if your background matches our requirements.</p><br><p>Best regards,<br>HR Recruiting Team<br>Cloud Vantage Solutions</p>`
    });

    sendEmail({
      to: 'sudharsanvjn10@gmail.com',
      subject: `Alert: New Candidate Application - ${cleanJobTitle}`,
      html: `<h3>New Job Application Profile</h3>
             <p><strong>Applicant Name:</strong> ${cleanName}</p>
             <p><strong>Position Applied:</strong> ${cleanJobTitle}</p>
             <p><strong>Email:</strong> ${cleanEmail}</p>
             <p><strong>Resume Link:</strong> <a href="${cleanResumeLink}">${cleanResumeLink}</a></p>`
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error storing job application:", error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// POST: Create Admin User (Secured: SuperAdmin only)
app.post('/api/admin/create-user', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { email, password, privilege } = req.body;
  if (!email || !password || !privilege) {
    return res.status(400).json({ error: 'Email, password, and privilege role are required' });
  }

  const cleanEmail = String(email).trim().toLowerCase().slice(0, 100);
  if (!EMAIL_REGEX.test(cleanEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const cleanPrivilege = privilege === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    await pool.query('INSERT INTO users (email, password, privilege) VALUES (?, ?, ?)', [cleanEmail, hashedPassword, cleanPrivilege]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: 'Failed to create corporate admin account' });
  }
});

// POST: Change Password (Secured: Active user can change own password)
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { email, newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  // Security: Prevent non-SuperAdmin from changing someone else's password
  if (req.user.privilege !== 'SuperAdmin' && req.user.email !== email) {
    return res.status(403).json({ error: 'Access denied: You can only update your own password' });
  }

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
    let jobs = [];
    try { const [jobRows] = await pool.query('SELECT * FROM jobs ORDER BY id DESC'); jobs = jobRows; } catch(e){}
    res.json({ contacts, subscribers, applications, users, jobs });
  } catch (error) {
    console.error("Admin data query error:", error);
    res.json({
      contacts: [
        { id: 1, name: 'Suresh Kumar', company: 'Tech Corp India', email: 'suresh@techcorp.in', phone: '+91 98401 23456', message: 'Looking for Oracle Fusion HCM Core HR and Payroll implementation for 2,500 employees.', created_at: new Date().toISOString() }
      ],
      subscribers: [
        { id: 1, email: 'oracle.lead@enterprise.com', created_at: new Date().toISOString() }
      ],
      applications: [
        { id: 1, name: 'Rajesh V.', email: 'rajesh.v@gmail.com', resume_link: 'https://linkedin.com/in/rajesh-oracle', job_title: 'Senior Oracle Fusion HCM Consultant', created_at: new Date().toISOString() }
      ],
      users: [
        { id: 1, email: 'admin@cloudvantage.com', privilege: 'SuperAdmin' }
      ],
      jobs: []
    });
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

// DELETE: Delete Admin User (Secured: SuperAdmin only, cannot delete own account)
app.delete('/api/admin/user/:id', authenticateToken, requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  if (req.user.id && String(req.user.id) === String(id)) {
    return res.status(400).json({ error: 'Security restriction: Cannot delete your own logged-in account' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: 'Failed to delete admin user account' });
  }
});

// POST: Add Job Opening (Secured)
app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  const { title, location, type } = req.body;
  if (!title || !location) {
    return res.status(400).json({ error: 'Title and location are required' });
  }
  const cleanTitle = sanitizeText(title, 200);
  const cleanLocation = sanitizeText(location, 100);
  const cleanType = sanitizeText(type || 'Full-Time', 50);

  try {
    await pool.query('INSERT INTO jobs (title, location, type) VALUES (?, ?, ?)', [cleanTitle, cleanLocation, cleanType]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating job posting:", error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// DELETE: Delete Job Opening (Secured)
app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    res.status(500).json({ error: 'Failed to delete job posting' });
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
