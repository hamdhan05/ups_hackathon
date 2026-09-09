'use strict';

require('dotenv').config();

const { connectDB } = require('./config/db');
const { port } = require('./config/env');
const app = require('./app');

async function startServer() {
  await connectDB();

  app.listen(port, () => {
    console.log(`LogiPulse backend running on port ${port}`);
    console.log(`Health: http://localhost:${port}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
