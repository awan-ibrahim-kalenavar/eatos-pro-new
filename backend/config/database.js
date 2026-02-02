const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Skip MongoDB connection for demo if not available
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost')) {
      console.log('🚀 Running in demo mode without MongoDB');
      console.log('📝 To use full functionality, set up MongoDB and update MONGODB_URI in .env');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, running in demo mode');
    console.log('📝 To use full functionality, set up MongoDB and update MONGODB_URI in .env');
    // Don't exit, just continue in demo mode
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
  }
  process.exit(0);
});

module.exports = connectDB;
