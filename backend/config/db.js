const mongoose = require('mongoose');

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pjms';
  console.log(`Attempting to connect to database...`);
  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('\n======================================================');
    console.error('DATABASE CONNECTION ERROR:');
    console.error(error.message);
    console.error('======================================================');
    console.error('Please configure your database before using the app:');
    console.error('1. Start your local MongoDB server (mongod), OR');
    console.error('2. Set MONGO_URI in your backend/.env to a MongoDB Atlas cluster URI.');
    console.error('======================================================\n');
  }
};

module.exports = connectDB;
