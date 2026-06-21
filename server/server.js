const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SECURITY MIDDLEWARE ---
// Right now, this is completely open for development. 
// ONCE YOU DEPLOY TO NETLIFY/VERCEL, update this to look like:
// app.use(cors({ origin: 'https://your-cloud-vantage-url.netlify.app' }));
app.use(cors()); 

app.use(express.json());

// --- MOCK DATABASE ---
const insightsData = [
  {
    id: '1',
    title: 'Maximizing ROI with Oracle Fusion HCM',
    excerpt: 'Discover strategies to optimize your human capital management deployment for long-term scalability.',
    date: 'October 12, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Migrating Legacy ERP to the Cloud',
    excerpt: 'A comprehensive roadmap for enterprises transitioning from on-premise systems to Oracle Cloud infrastructure.',
    date: 'September 28, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Supply Chain Resilience in Modern Logistics',
    excerpt: 'How Oracle Fusion SCM modules are helping global logistics firms navigate complex supply network disruptions.',
    date: 'September 15, 2026',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8ed7450862?q=80&w=600&auto=format&fit=crop'
  }
];

const teamData = [
  {
    id: '1', name: 'Jeevanantham R.', title: 'Founder & Director',
    bio: '20+ years expertise as an Oracle HCM Cloud Solution Architect driving global transformation.',
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '2', name: 'Mahendran P.', title: 'Delivery Head',
    bio: 'Spearheading offshore delivery centers to ensure precision and scale for enterprise clients.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '3', name: 'Ilampooranan C.S', title: 'Technical Head',
    bio: 'Chief architect overseeing system integrations and full-stack technical excellence.',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: '4', name: 'Srinivas A.', title: 'Sales & Marketing Specialist',
    bio: 'Connecting enterprises with the precise Oracle solutions needed to scale their operations.',
    photoUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=400&auto=format&fit=crop'
  }
];

// --- API ENDPOINTS ---

// GET /api/insights
app.get('/api/insights', (req, res) => {
  setTimeout(() => {
    res.json(insightsData);
  }, 500); 
});

// GET /api/team
app.get('/api/team', (req, res) => {
  setTimeout(() => {
    res.json(teamData);
  }, 500);
});

// GET health check
app.get('/api/status', (req, res) => {
  res.json({ status: 'Online', service: 'Cloud Vantage Dedicated API', timestamp: new Date() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n🚀 Cloud Vantage API (Decoupled Mode) running on port ${PORT}`);
  console.log(`Endpoints available:`);
  console.log(` - /api/insights`);
  console.log(` - /api/team`);
  console.log(` - /api/status\n`);
  console.log(`Waiting for live production requests...`);
});