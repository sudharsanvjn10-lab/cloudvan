const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
  console.log("Connecting to Aiven MySQL database to update content...");
  try {
    const connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('?ssl-mode=REQUIRED', '') : undefined,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // 1. UPDATE TEAM BIOS
    console.log("Updating Team Bios...");
    await connection.execute(`UPDATE team_members SET name = '.', title = 'Founder & Director', bio = 'Lead Oracle HCM Cloud Solution Architect with over 20+ years of extensive experience and expertise. Oversees Service Delivery and Global operations. Prior to founding Cloud Vantage, held key positions at Bahwan Cybertek, Hexaware Transsys, and others.' WHERE id = 1`);
    await connection.execute(`UPDATE team_members SET name = 'Mahendran P', title = 'Delivery Head', bio = '18+ years of overall IT experience in Oracle and related technologies, with hands-on project implementation experience in Agile methodology. Leads the EBS Technical Competency spanning EBS Technical, Fusion ERP, Fusion HCM, and Fusion Integration (OIC/ICS/SOA).' WHERE id = 2`);
    await connection.execute(`UPDATE team_members SET name = 'Ilampooranan C.S', title = 'Technical Head', bio = 'Over two decades of experience in Oracle Developer Suite and Oracle EBS. Leads implementation of customized solutions for clients, with deep understanding of the Oracle HCM Cloud Suite.' WHERE id = 3`);
    await connection.execute(`UPDATE team_members SET name = 'Srinivas A', title = 'Sales and Marketing Specialist', bio = 'Driven by a passion for identifying and delivering solutions aligned with client needs. Responsible for crafting and executing sales strategy, fostering growth, and leading business development initiatives.' WHERE id = 4`);

    // 2. UPDATE INSIGHTS
    console.log("Updating Insights...");
    await connection.execute(`UPDATE insights SET title = 'Why a Cloud Based ERP Solution is Essential for Modern Businesses', excerpt = 'Discover how modern cloud ERP systems eliminate data silos, enhance real-time decision making, and provide the agility needed to scale in today\\'s competitive digital economy.', date = 'June 21, 2026' WHERE id = 1`);
    await connection.execute(`UPDATE insights SET title = 'What\\'s Ahead in 2025: Oracle HCM Product Priorities Unveiled', excerpt = 'Explore the strategic roadmap for Oracle HCM Cloud, featuring upcoming AI-driven talent management tools, enhanced user experiences, and advanced predictive analytics.', date = 'June 18, 2026' WHERE id = 2`);
    await connection.execute(`UPDATE insights SET title = 'Transform Payroll Management: Oracle\\'s Intelligent Global Approach', excerpt = 'Learn how Oracle\\'s unified payroll solutions reduce compliance risks, automate complex calculations, and deliver seamless global payroll operations for diverse workforces.', date = 'June 10, 2026' WHERE id = 3`);

    console.log("✅ Live database content update complete!");
    await connection.end();

  } catch (error) {
    console.error("❌ Error updating database:", error);
  }
}

updateDatabase();