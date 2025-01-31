import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const connectToMongoDB = async () => {
    
    try {
        await mongoose.connect(MONGO_URL);
        console.log(`App is connected to MongoDB`);

    } catch (error) {
        console.log('Error connecting to MongoDB', error.message)
    }
};

export default connectToMongoDB;