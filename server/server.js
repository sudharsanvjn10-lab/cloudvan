const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- SECURITY MIDDLEWARE ---
app.use(cors()); 
app.use(express.json());

// --- DATABASE CONNECTION POOL ---
// This safely manages multiple connections to your MySQL database
// We parse the URL and explicitly enable SSL for Aiven
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace('?ssl-mode=REQUIRED', '') : undefined,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- API ENDPOINTS ---

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

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'Online', 
    service: 'Cloud Vantage Dedicated API', 
    database: 'MySQL Configured',
    timestamp: new Date() 
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Cloud Vantage API running on port ${PORT}`);
  console.log(`Waiting for live production requests...`);
});