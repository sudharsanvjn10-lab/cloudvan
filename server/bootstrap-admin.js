/**
 * Secure Administrator Bootstrap CLI Tool
 * Usage: node server/bootstrap-admin.js <email> <password> [SuperAdmin|Admin]
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { databaseOptions } = require('./database-options');
require('dotenv').config();

async function bootstrapAdmin() {
  const args = process.argv.slice(2);
  const email = (args[0] || process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = args[1] || process.env.BOOTSTRAP_ADMIN_PASSWORD || '';
  const privilege = (args[2] || 'SuperAdmin') === 'SuperAdmin' ? 'SuperAdmin' : 'Admin';

  if (!email || !password) {
    console.error("❌ Usage: node server/bootstrap-admin.js <email> <password> [SuperAdmin|Admin]");
    console.error("   Or set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD environment variables.");
    process.exit(1);
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!EMAIL_REGEX.test(email)) {
    console.error("❌ Invalid email format.");
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("❌ Password must be at least 10 characters for administrative accounts.");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment.");
    process.exit(1);
  }

  let connection;
  try {
    connection = await mysql.createConnection(databaseOptions());

    // Ensure users table exists with token_version
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        privilege VARCHAR(50) NOT NULL DEFAULT 'Admin',
        token_version INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const hashedPassword = bcrypt.hashSync(password, 12);

    const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      // Invalidate existing sessions on password reset
      await connection.execute(
        'UPDATE users SET password = ?, privilege = ?, token_version = token_version + 1 WHERE email = ?',
        [hashedPassword, privilege, email]
      );
      console.log(`✅ Updated existing user ${email} (${privilege}). All existing active sessions were invalidated.`);
    } else {
      await connection.execute(
        'INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, ?, 1)',
        [email, hashedPassword, privilege]
      );
      console.log(`✅ Successfully bootstrapped new ${privilege} user: ${email}`);
    }

  } catch (error) {
    console.error("❌ Failed to bootstrap admin user:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

bootstrapAdmin();
