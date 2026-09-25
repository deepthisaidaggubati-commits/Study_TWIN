const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri && process.env.NODE_ENV === 'production') {
      throw new Error('MONGODB_URI environment variable is required in production');
    }

    const conn = await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/studytwin');
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
