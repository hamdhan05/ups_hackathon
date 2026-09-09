'use strict';

const mongoose = require('mongoose');
const { mongoUri } = require('./env');

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected');
});

function getConnectionState() {
  return {
    isConnected,
    state: mongoose.connection.readyState,
  };
}

module.exports = { connectDB, getConnectionState };
