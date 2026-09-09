'use strict';

require('dotenv').config();

const { connectDB } = require('./config/db');
const { port } = require('./config/env');
const app = require('./app');

async function startServer() {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`LogiPulse backend running on 0.0.0.0:${port}`);
    console.log(`Health: http://localhost:${port}/api/health`);
  });

  connectDB().then(() => {
    console.log('Database connection ready.');
  }).catch((err) => {
    console.error('Initial MongoDB connection attempt error:', err.message);
  });
}

startServer();

