const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

console.log('[DEBUG server.js] EMAIL_USER:', process.env.EMAIL_USER);
console.log('[DEBUG server.js] EMAIL_PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

const { initializeDatabase } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bugRoutes = require('./routes/bugRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bugs', bugRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Bug Tracker API is running.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// Initialize DB and start server
async function startServer() {
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
    console.error('JWT_SECRET is not set in .env — server cannot start securely');
    process.exit(1);
  }

  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
