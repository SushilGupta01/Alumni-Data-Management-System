const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const alumniRoutes = require('./routes/alumni');
const donationRoutes = require('./routes/donation');
const achievementRoutes = require('./routes/achievement');
const projectRoutes = require('./routes/project');
const jobRoutes = require('./routes/job');
const degreeRoutes = require('./routes/degree');

const app = express();
const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:5177',
//   credentials: true
// }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/degrees', degreeRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'NIT Sikkim Alumni Management Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NIT Sikkim Alumni Data Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      alumni: '/api/alumni',
      donations: '/api/donations',
      achievements: '/api/achievements',
      projects: '/api/projects',
      jobs: '/api/jobs',
      degrees: '/api/degrees'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════╗');
      console.log('║   🎓 NIT SIKKIM ALUMNI MANAGEMENT SYSTEM 🎓          ║');
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log(`║   Server running on: http://localhost:${PORT}           ║`);
      console.log(`║   Environment: ${process.env.NODE_ENV || 'development'}                           ║`);
      console.log(`║   Database: ${process.env.DB_NAME}                            ║`);
      console.log('╠════════════════════════════════════════════════════════╣');
      console.log('║   API Endpoints:                                       ║');
      console.log(`║   • POST   /api/auth/login                             ║`);
      console.log(`║   • GET    /api/auth/me                                ║`);
      console.log(`║   • GET    /api/alumni                                 ║`);
      console.log(`║   • GET    /api/donations                              ║`);
      console.log(`║   • GET    /api/achievements                           ║`);
      console.log(`║   • GET    /api/projects                               ║`);
      console.log(`║   • GET    /api/jobs                                   ║`);
      console.log(`║   • GET    /api/degrees                                ║`);
      console.log('╚════════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();