const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  console.log("Connecting to Aiven MySQL database...");
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // 1. Create the Insights Table
    console.log("Creating 'insights' table...");
    await connection.execute("DROP TABLE IF EXISTS insights");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS insights (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        excerpt TEXT NOT NULL,
        date VARCHAR(50) NOT NULL,
        imageUrl VARCHAR(500)
      )
    `);

    // 2. Insert Mock Insights Data
    console.log("Inserting Insights data...");
    await connection.execute(`
      INSERT INTO insights (title, excerpt, date, imageUrl) VALUES
      ('Maximizing ROI with Oracle Fusion HCM', 'Discover proven strategies to optimize your human capital management deployment for long-term scalability.', 'October 12, 2026', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'),
      ('Migrating Legacy HRMS to Oracle Fusion HCM', 'A comprehensive roadmap for enterprises transitioning from on-premise systems to modern Oracle Cloud HCM.', 'September 28, 2026', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'),
      ('Modernizing Employee Journeys with Redwood UI', 'How Oracle Redwood UI and Visual Builder Studio enable streamlined employee self-service.', 'September 15, 2026', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop');

    // 3. Create the Team Table
    console.log("Creating 'team_members' table...");
    await connection.execute("DROP TABLE IF EXISTS team_members");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        bio TEXT,
        photoUrl VARCHAR(500)
      )
    `);

    // 4. Insert Mock Team Data
    console.log("Inserting Team data...");
    await connection.execute(`
      INSERT INTO team_members (name, title, bio, photoUrl) VALUES
      ('Jeevanantham R.', 'Founder & Director', '20+ years expertise as an Oracle HCM Cloud Solution Architect driving global transformation.', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop'),
      ('Mahendran P.', 'Delivery Head', 'Spearheading offshore delivery centers to ensure precision and scale for enterprise clients.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop'),
      ('Ilampooranan C.S', 'Technical Head', 'Chief architect overseeing system integrations and full-stack technical excellence.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'),
      ('Srinivas A.', 'Sales & Marketing Specialist', 'Connecting enterprises with the precise Oracle solutions needed to scale their operations.', 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop')
    `);

    // 5. Create Users Table
    console.log("Creating 'users' table...");
    await connection.execute("DROP TABLE IF EXISTS users");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        privilege VARCHAR(50) NOT NULL DEFAULT 'Admin'
      )
    `);

    // Insert Default Admin
    console.log("Inserting Default Admin...");
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);
    await connection.execute(`
      INSERT IGNORE INTO users (email, password, privilege) VALUES
      (?, ?, ?)
    `, ['admin@cloudvantage.com', hashedPassword, 'SuperAdmin']);

    // 6. Create Contact Inquiries Table
    console.log("Creating 'contact_messages' table...");
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

    // 7. Create Newsletter Subscribers Table
    console.log("Creating 'newsletter_subscribers' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 8. Create Job Applications Table
    console.log("Creating 'job_applications' table...");
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

    // 9. Create Visitor Stats Table
    console.log("Creating 'visitor_stats' table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS visitor_stats (
        id INT PRIMARY KEY,
        count INT NOT NULL DEFAULT 0
      )
    `);
    await connection.execute(`
      INSERT IGNORE INTO visitor_stats (id, count) VALUES (1, 0)
    `);

    console.log("✅ Database setup complete!");
    await connection.end();

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  }
}

setupDatabase();