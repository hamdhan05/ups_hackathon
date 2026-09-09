'use strict';

const mongoose = require('mongoose');
const { mongoUri } = require('./env');

let isConnected = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (err) {
    isConnected = false;
    console.error('MongoDB connection error:', err.message);
  }
}

mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected');
});

function getConnectionState() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    state: mongoose.connection.readyState,
  };
}

module.exports = { connectDB, getConnectionState };
