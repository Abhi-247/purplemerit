import mongoose from 'mongoose';

// MongoDB connection utility for serverless environment

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your MONGODB_URI to environment variables');
  }

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log('=> New database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};
