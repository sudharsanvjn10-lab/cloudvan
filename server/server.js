const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { databaseOptions } = require('./database-options');
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

// Security Requirement 1: Require strong configured JWT_SECRET at startup and fail closed
const rawJwtSecret = process.env.JWT_SECRET;
if (!rawJwtSecret || typeof rawJwtSecret !== 'string' || rawJwtSecret.trim().length < 32) {
  console.error('❌ FATAL SECURITY ERROR: A secure JWT_SECRET environment variable (minimum 32 characters) must be configured.');
  console.error('❌ Server is halting immediately to prevent insecure authentication operation.');
  process.exit(1);
}
const JWT_SECRET = rawJwtSecret.trim();

// Security: Enforce Strict CORS Policy with configurable deployment origins
const defaultAllowedOrigins = [
  'http://localhost:4200',
  'http://127.0.0.1:4200',
  'http://localhost:3000',
  'https://cloudvan-ui.onrender.com',
  'https://sudharsanvjn10-lab.github.io'
];
const extraOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : [];
const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...extraOrigins]));

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
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Too many requests. Please slow down.' }
});
app.use('/api/', generalApiLimiter);

// Strict Rate Limiter for Login (Max 5 attempts per 15 minutes in production)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Too many login attempts from this IP. Please try again after 15 minutes.' }
});

// Rate Limiter for Form Submissions (Max 10 per 15 minutes in production)
const formSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Submission limit exceeded. Please wait a few minutes before trying again.' }
});

// Database TLS/CA Configuration helper
// Database Pool Connection
const pool = mysql.createPool({
  ...databaseOptions(),
  waitForConnections: false,
  connectionLimit: 5,
  queueLimit: 0,
  connectTimeout: 2000
});

// Authentication Middleware with Active Session & Revocation Check
async function authenticateToken(req, res, next) {
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

    // Invalidate stale sessions: verify user still exists in DB and token_version has not been bumped
    try {
      const [rows] = await pool.query('SELECT id, email, privilege, token_version FROM users WHERE id = ?', [decoded.id]);
      if (!rows || rows.length === 0) {
        return res.status(401).json({ error: 'Access denied: User account no longer exists' });
      }
      const dbUser = rows[0];
      const currentVersion = dbUser.token_version || 1;
      const decodedVersion = decoded.tokenVersion || 1;
      if (currentVersion !== decodedVersion) {
        return res.status(401).json({ error: 'Access denied: Session invalidated due to credential change. Please log in again.' });
      }
      req.user = { id: dbUser.id, email: dbUser.email, privilege: dbUser.privilege };
      next();
    } catch (dbErr) {
      console.error("Token verification DB lookup error:", dbErr.message);
      return res.status(503).json({ error: 'Authentication service temporarily unavailable' });
    }
  } catch (error) {
    return res.status(403).json({ error: 'Access denied: Invalid or expired session' });
  }
}

// SuperAdmin-only Authorization Middleware
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.privilege !== 'SuperAdmin') {
    return res.status(403).json({ error: 'Access denied: SuperAdmin privileges required' });
  }
  next();
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Secure Email Dispatch: Prevents PII Leakage in mock and production logs
async function sendEmail({ to, subject, html }) {
  const maskedTo = typeof to === 'string' && to.includes('@')
    ? to.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => `${a}${'*'.repeat(Math.min(b.length, 5))}${c}`)
    : '[REDACTED]';

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // PII Protection: Mask recipient and suppress message body from console logs
    console.log(`[SMTP MOCK] Email notification queued for ${maskedTo}. Subject: "${subject}". Content suppressed to prevent PII logging.`);
    return { delivered: false, simulated: true };
  }
  try {
    await transporter.sendMail({
      from: `"Cloud Vantage Solutions" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`[SMTP SUCCESS] Sent email to ${maskedTo}`);
    return { delivered: true, simulated: false };
  } catch (error) {
    console.error(`[SMTP ERROR] Failed to send email to ${maskedTo}:`, error.message);
    return { delivered: false, error: error.message };
  }
}

// Email & Input Sanitization
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[0-9\s\-()]{7,25}$/;

function sanitizeText(str, maxLength = 1000) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

// GET: Insights
app.get('/api/insights', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM insights ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching insights:", error.message);
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

// GET: Team Members
app.get('/api/team', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM team_members');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching team:", error.message);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// GET: Active Job Listings (Read-only, preserves intentionally empty list, reports errors accurately)
app.get('/api/jobs', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error("Database error fetching jobs:", error.message);
    res.status(500).json({ error: 'Failed to fetch job openings' });
  }
});

// POST: Secure Corporate Login (Fails closed on DB error, no hardcoded credentials or signing fallbacks)
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
        const tokenVersion = user.token_version || 1;
        const token = jwt.sign(
          { id: user.id, email: user.email, privilege: user.privilege, tokenVersion },
          JWT_SECRET,
          { expiresIn: '12h' }
        );
        return res.json({ token, email: user.email, privilege: user.privilege });
      }
    }
    return res.status(401).json({ error: 'Invalid corporate credentials' });
  } catch (error) {
    console.error("Login verification error:", error.message);
    // Security: Fail closed immediately during DB outage - never issue mock or fallback tokens
    return res.status(503).json({ error: 'Authentication service temporarily unavailable. Please try again later.' });
  }
});

// POST: Contact Form Submit (Surfaces email delivery failure independently of database storage)
app.post('/api/contact', formSubmissionLimiter, async (req, res) => {
  if (req.body.website && String(req.body.website).trim().length > 0) {
    console.warn(`[SPAM BOT BLOCKED] Honeypot triggered on /api/contact from IP: ${req.ip}`);
    return res.json({ success: true, message: 'Message sent successfully', emailDelivered: true });
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

    let emailDelivered = true;
    try {
      const results = await Promise.allSettled([
        sendEmail({
          to: cleanEmail,
          subject: 'Inquiry Received - Cloud Vantage Solutions',
          html: `<p>Dear ${cleanName},</p><p>Thank you for contacting Cloud Vantage Solutions. We have received your inquiry regarding <strong>${cleanCompany || 'Oracle Fusion HCM'}</strong>. Our specialized team will get back to you shortly.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
        }),
        sendEmail({
          to: process.env.ADMIN_ALERT_EMAIL || 'info@cloudvantagesolutions.com',
          subject: 'Alert: New Inward Oracle HCM Contact Inquiry',
          html: `<h3>New Inward Contact Message</h3><p><strong>Name:</strong> ${cleanName}</p><p><strong>Company:</strong> ${cleanCompany || 'N/A'}</p><p><strong>Email:</strong> ${cleanEmail}</p><p><strong>Phone:</strong> ${cleanPhone}</p><p><strong>Message:</strong> ${cleanMessage}</p>`
        })
      ]);
      const userMail = results[0];
      if (userMail.status === 'fulfilled' && userMail.value && userMail.value.delivered === false) {
        emailDelivered = false;
      }
    } catch (mailErr) {
      console.warn("Non-fatal email dispatch failure:", mailErr.message);
      emailDelivered = false;
    }

    res.json({
      success: true,
      message: emailDelivered ? 'Message sent successfully' : 'Message recorded successfully. Note: Notification email could not be delivered.',
      emailDelivered
    });
  } catch (error) {
    console.error("Error storing contact message:", error.message);
    res.status(500).json({ error: 'Failed to submit query' });
  }
});

// POST: Newsletter Subscribe
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

    const delivery = await sendEmail({
      to: cleanEmail,
      subject: 'Subscription Confirmed - Cloud Vantage Solutions',
      html: `<p>Hello,</p><p>Thank you for subscribing to Cloud Vantage Solutions insights. You will receive updates about Oracle Fusion HCM trends and technical deep-dives.</p><br><p>Best regards,<br>Cloud Vantage Solutions Team</p>`
    });

    res.json({ success: true, emailDelivered: delivery.delivered });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.json({ success: true, message: 'Already subscribed' });
    }
    console.error("Subscription error:", error.message);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// POST: Job Application Submit
app.post('/api/apply', formSubmissionLimiter, async (req, res) => {
  if (req.body.website && String(req.body.website).trim().length > 0) {
    console.warn(`[SPAM BOT BLOCKED] Honeypot triggered on /api/apply from IP: ${req.ip}`);
    return res.json({ success: true, message: 'Application received', emailDelivered: true });
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
  if (!/^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/i.test(cleanResumeLink)) {
    return res.status(400).json({ error: 'Resume link must be a secure HTTPS document URL (e.g. Google Drive, Dropbox, LinkedIn).' });
  }

  try {
    await pool.query(
      'INSERT INTO job_applications (name, email, resume_link, job_title) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, cleanResumeLink, cleanJobTitle]
    );

    let emailDelivered = true;
    try {
      const results = await Promise.allSettled([
        sendEmail({
          to: cleanEmail,
          subject: 'Application Received - Cloud Vantage Solutions',
          html: `<p>Dear ${cleanName},</p><p>Thank you for applying for the position of <strong>${cleanJobTitle}</strong> at Cloud Vantage Solutions. We have received your profile and resume. Our hiring team will review your application and reach out if your background matches our requirements.</p><br><p>Best regards,<br>HR Recruiting Team<br>Cloud Vantage Solutions</p>`
        }),
        sendEmail({
          to: process.env.ADMIN_ALERT_EMAIL || 'info@cloudvantagesolutions.com',
          subject: `Alert: New Candidate Application - ${cleanJobTitle}`,
          html: `<h3>New Job Application Profile</h3><p><strong>Applicant Name:</strong> ${cleanName}</p><p><strong>Position Applied:</strong> ${cleanJobTitle}</p><p><strong>Email:</strong> ${cleanEmail}</p><p><strong>Resume Link:</strong> <a href="${cleanResumeLink}">${cleanResumeLink}</a></p>`
        })
      ]);
      const userMail = results[0];
      if (userMail.status === 'fulfilled' && userMail.value && userMail.value.delivered === false) {
        emailDelivered = false;
      }
    } catch (mailErr) {
      console.warn("Non-fatal email dispatch failure:", mailErr.message);
      emailDelivered = false;
    }

    res.json({
      success: true,
      message: emailDelivered ? 'Application received successfully' : 'Application recorded successfully. Note: Notification email could not be delivered.',
      emailDelivered
    });
  } catch (error) {
    console.error("Error storing job application:", error.message);
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

  if (password.length < 10) {
    return res.status(400).json({ error: 'Password must be at least 10 characters for admin accounts' });
  }

  const cleanPrivilege = privilege === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  try {
    const hashedPassword = bcrypt.hashSync(password, 12);
    await pool.query(
      'INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, ?, 1)',
      [cleanEmail, hashedPassword, cleanPrivilege]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: 'Failed to create corporate admin account' });
  }
});

// POST: Change Password (Invalidates all active sessions by bumping token_version)
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { email, newPassword } = req.body;
  if (!newPassword || newPassword.length < 10) {
    return res.status(400).json({ error: 'New password must be at least 10 characters' });
  }

  // Security: Prevent non-SuperAdmin from changing someone else's password
  if (req.user.privilege !== 'SuperAdmin' && req.user.email !== email) {
    return res.status(403).json({ error: 'Access denied: You can only update your own password' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 12);
    const targetEmail = req.user.privilege === 'SuperAdmin' ? email : req.user.email;
    const [result] = await pool.query(
      'UPDATE users SET password = ?, token_version = COALESCE(token_version, 1) + 1 WHERE email = ?',
      [hashedPassword, targetEmail]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User account not found' });
    }

    res.json({ success: true, message: 'Password updated. Previous sessions invalidated.' });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ error: 'Failed to update credentials' });
  }
});

// GET: Admin Dashboard Data (Secured, role-filtered users list, no mock fallback data)
app.get('/api/admin/data', authenticateToken, async (req, res) => {
  try {
    const [contacts] = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    const [subscribers] = await pool.query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC');
    const [applications] = await pool.query('SELECT * FROM job_applications ORDER BY created_at DESC');

    // Role enforcement: Only SuperAdmins can view registered admin user accounts
    let users = [];
    if (req.user.privilege === 'SuperAdmin') {
      const [userRows] = await pool.query('SELECT id, email, privilege, created_at FROM users');
      users = userRows;
    }

    let jobs = [];
    try {
      const [jobRows] = await pool.query('SELECT * FROM jobs ORDER BY id DESC');
      jobs = jobRows;
    } catch (e) {
      console.warn("Could not query jobs for admin dashboard:", e.message);
    }

    res.json({ contacts, subscribers, applications, users, jobs });
  } catch (error) {
    console.error("Admin data query error:", error.message);
    // Security: Fail closed without exposing mock data
    res.status(500).json({ error: 'Failed to retrieve administrative records' });
  }
});

// DELETE: Delete Job Application (Secured)
app.delete('/api/admin/application/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM job_applications WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting job application:", error.message);
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
    console.error("Error deleting contact message:", error.message);
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
    console.error("Error deleting newsletter subscriber:", error.message);
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
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User account not found' });
    }
    // Deleting the user automatically invalidates their session on subsequent requests
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error.message);
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
    console.error("Error creating job posting:", error.message);
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
    console.error("Error deleting job posting:", error.message);
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

// POST: Record and increment page visit count
let localVisits = 1450;

app.post('/api/visits', async (req, res) => {
  try {
    await pool.query('UPDATE visitor_stats SET count = count + 1 WHERE id = 1');
    const [rows] = await pool.query('SELECT count FROM visitor_stats WHERE id = 1');
    res.json({ count: rows[0] ? rows[0].count : 0 });
  } catch (error) {
    res.json({ count: ++localVisits });
  }
});

// GET: Fetch current page visit count
app.get('/api/visits', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT count FROM visitor_stats WHERE id = 1');
    res.json({ count: rows[0] ? rows[0].count : 0 });
  } catch (error) {
    res.json({ count: localVisits });
  }
});

app.get('/api/ready', async (req, res) => {
  try {
    await pool.query({ sql: 'SELECT token_version FROM users LIMIT 0', timeout: 2000 });
    await pool.query({ sql: 'SELECT id FROM jobs LIMIT 0', timeout: 2000 });
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Cloud Vantage Solutions API running on port ${PORT}`);
    console.log(`Waiting for live production requests...`);
  });
}

module.exports = { app, pool, JWT_SECRET, authenticateToken, requireSuperAdmin };
