const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log("Connecting to Aiven MySQL database...");
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // 1. Create the Insights Table
    console.log("Creating 'insights' table...");
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
      ('Maximizing ROI with Oracle Fusion HCM', 'Discover strategies to optimize your human capital management deployment for long-term scalability.', 'October 12, 2026', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'),
      ('Migrating Legacy ERP to the Cloud', 'A comprehensive roadmap for enterprises transitioning from on-premise systems to Oracle Cloud infrastructure.', 'September 28, 2026', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'),
      ('Supply Chain Resilience in Modern Logistics', 'How Oracle Fusion SCM modules are helping global logistics firms navigate complex supply network disruptions.', 'September 15, 2026', 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=600&auto=format&fit=crop')
    `);

    // 3. Create the Team Table
    console.log("Creating 'team_members' table...");
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

    console.log("✅ Database setup complete!");
    await connection.end();

  } catch (error) {
    console.error("❌ Error setting up database:", error);
  }
}

setupDatabase();