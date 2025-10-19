import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('ERROR: Database connection string is not defined in environment variables.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Error on database connection', error);
    process.exit(1);
  }
};

export default connectDB;