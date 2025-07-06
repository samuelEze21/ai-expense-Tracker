// Load test environment variables FIRST
require('dotenv').config({ path: '.env.test' });

const mongoose = require('mongoose');

beforeAll(async () => {
  // Close any existing connections
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  
  // Connect to test database
  const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/aiexpensetracker_test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}, 30000); // Increase timeout to 30 seconds

afterEach(async () => {
  // Clean up database after each test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}, 10000); // Increase timeout to 10 seconds

afterAll(async () => {
  // Drop database and close connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
}, 30000); // Increase timeout to 30 seconds