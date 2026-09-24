const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected or connecting in serverless context, re-use existing connection
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/serviq', {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[MongoDB Warning] Please ensure your MONGODB_URI is configured correctly.`);
  }
};

module.exports = connectDB;
