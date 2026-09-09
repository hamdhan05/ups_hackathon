'use strict';

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const operationRoutes = require('./routes/operationRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const capacityRoutes = require('./routes/capacityRoutes');
const bottleneckRoutes = require('./routes/bottleneckRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const errorHandler = require('./middleware/errorHandler');
const { getConnectionState } = require('./config/db');

const app = express();

// CORS — allow local dev and production frontend origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : []),
].map((o) => o.trim()).filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for deployment ease
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// Health check (public)
app.get('/api/health', (req, res) => {
  const db = getConnectionState();
  res.json({
    success: true,
    data: {
      status: 'ok',
      database: db.isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});

// Ensure DB connection for API routes
app.use('/api', async (req, res, next) => {
  if (req.path === '/health') return next();
  const db = getConnectionState();
  if (!db.isConnected) {
    const { connectDB } = require('./config/db');
    await connectDB();
  }
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/capacity', capacityRoutes);
app.use('/api/bottlenecks', bottleneckRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/simulation', simulationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
