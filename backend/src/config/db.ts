import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kitchen-utensils';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected...');
    } catch (err: any) {
        console.warn(`Warning: Could not connect to MongoDB: ${err.message}`);
        console.log('Server will continue running, but database operations will fail.');
    }
};

export default connectDB;
