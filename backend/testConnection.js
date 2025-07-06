const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Atlas connected successfully!');
    console.log('Database:', mongoose.connection.db.databaseName);
    await mongoose.disconnect();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

testConnection();