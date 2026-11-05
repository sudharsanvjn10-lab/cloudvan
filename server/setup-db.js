const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { databaseOptions } = require('./database-options');
require('dotenv').config();

async function runMigrations() {
  console.log("🔄 Connecting to MySQL database for repeatable migrations...");

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required for database migrations.');
    process.exitCode = 1;
    return;
  }

  let connection;

  try {
    connection = await mysql.createConnection(databaseOptions());

    console.log(" Connected to database. Applying repeatable migrations without destructive drops...");

    // 1. Insights Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS insights (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        imageUrl VARCHAR(500)
      )
    `);
    const [insightsRows] = await connection.execute('SELECT COUNT(*) AS count FROM insights');
    if (insightsRows[0].count === 0) {
      console.log("Seeding initial insights data...");
      await connection.execute(`
        INSERT INTO insights (title, excerpt, date, imageUrl) VALUES
        ('Maximizing ROI with Oracle Fusion HCM', 'Discover proven strategies to optimize your human capital management deployment for long-term scalability.', 'October 12, 2026', 'assets/images/photo-1551288049-bebda4e38f71.webp'),
        ('Migrating Legacy HRMS to Oracle Fusion HCM', 'A comprehensive roadmap for enterprises transitioning from on-premise systems to modern Oracle Cloud HCM.', 'September 28, 2026', 'assets/images/photo-1451187580459-43490279c0fa.webp'),
        ('Modernizing Employee Journeys with Redwood UI', 'How Oracle Redwood UI and Visual Builder Studio enable streamlined employee self-service.', 'September 15, 2026', 'assets/images/photo-1507238691740-187a5b1d37b8.webp')
      `);
    } else {
      console.log(` Preserved existing insights (${insightsRows[0].count} records).`);
    }

    // 2. Team Members Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        bio TEXT,
        photoUrl VARCHAR(500)
      )
    `);
    const [teamRows] = await connection.execute('SELECT COUNT(*) AS count FROM team_members');
    if (teamRows[0].count === 0) {
      console.log("Seeding initial team data...");
      await connection.execute(`
        INSERT INTO team_members (name, title, bio, photoUrl) VALUES
        ('Jeevanantham R.', 'Founder & Director', '20+ years expertise as an Oracle HCM Cloud Solution Architect driving global transformation.', 'assets/jeevanantham.png'),
        ('Mahendran P.', 'Delivery Head', 'Spearheading offshore delivery centers to ensure precision and scale for enterprise clients.', 'assets/mahendran.png'),
        ('Ilampooranan C.S', 'Technical Head', 'Chief architect overseeing system integrations and full-stack technical excellence.', 'assets/ilampooranan.png'),
        ('Srinivas A.', 'Sales & Marketing Specialist', 'Connecting enterprises with the precise Oracle solutions needed to scale their operations.', 'assets/srinivas.png')
      `);
    } else {
      console.log(` Preserved existing team members (${teamRows[0].count} records).`);
    }

    // 3. Users Table (with token_version for session invalidation)
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

    // Ensure token_version column exists for existing tables
    const [colRows] = await connection.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'token_version'
    `);
    if (colRows.length === 0) {
      console.log("Migrating users schema: adding token_version column...");
      await connection.execute(`ALTER TABLE users ADD COLUMN token_version INT NOT NULL DEFAULT 1`);
    }

    // Explicit Secure Admin Bootstrap (No hardcoded seeds)
    const [userRows] = await connection.execute('SELECT COUNT(*) AS count FROM users');
    if (userRows[0].count === 0) {
      const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
      const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;

      if (bootstrapEmail && bootstrapPassword) {
        if (bootstrapPassword.length < 10) {
          console.warn("⚠️ BOOTSTRAP_ADMIN_PASSWORD must be at least 10 characters. SuperAdmin not bootstrapped.");
        } else {
          console.log(`Bootstrapping initial SuperAdmin (${bootstrapEmail})...`);
          const hashedPassword = bcrypt.hashSync(bootstrapPassword, 12);
          await connection.execute(
            `INSERT INTO users (email, password, privilege, token_version) VALUES (?, ?, 'SuperAdmin', 1)`,
            [bootstrapEmail.trim().toLowerCase(), hashedPassword]
          );
          console.log("✅ Initial SuperAdmin created successfully from environment variables.");
        }
      } else {
        console.log("ℹ️ No admin accounts exist yet. To create the first SuperAdmin securely, run:");
        console.log("   node server/bootstrap-admin.js <email> <password>");
        console.log("   or set BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD in environment.");
      }
    } else {
      console.log(` Preserved existing users (${userRows[0].count} accounts). Default seeds prevented.`);
    }

    // 4. Jobs Table Schema (Repeatable migration, preserves intentionally empty list)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(100) NOT NULL,
        type VARCHAR(50) DEFAULT 'Full-Time',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log(" Jobs schema verified.");

    // 5. Contact Inquiries Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Newsletter Subscribers Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Job Applications Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        resume_link VARCHAR(500) NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Visitor Stats Table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitor_stats (
        id INT PRIMARY KEY,
        count INT NOT NULL DEFAULT 0
      )
    `);
    await connection.execute(`
      INSERT IGNORE INTO visitor_stats (id, count) VALUES (1, 0)
    `);

    console.log("✅ All repeatable database migrations completed successfully without destructive actions!");

  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exitCode = 1;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
