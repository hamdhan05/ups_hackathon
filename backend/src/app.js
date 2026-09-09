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
const errorHandler = require('./middleware/errorHandler');
const { getConnectionState } = require('./config/db');

const app = express();

// CORS — allow the React dev server
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/capacity', capacityRoutes);
app.use('/api/bottlenecks', bottleneckRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
