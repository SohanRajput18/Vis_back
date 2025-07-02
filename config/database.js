// config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      console.log('💡 Please create a .env file in the server directory with:');
      console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/data-visualization?retryWrites=true&w=majority');
      process.exit(1);
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    
    // Modern connection method (Mongoose 6+)
    const conn = await mongoose.connect(mongoURI, {
      // Atlas connection options
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);

    // Optional: Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Check your MongoDB Atlas connection string');
    console.log('   - Verify username and password are correct');
    console.log('   - Ensure your IP is whitelisted in Atlas');
    console.log('   - Check if your Atlas cluster is running');
    process.exit(1);
  }
};

export default connectDB;
