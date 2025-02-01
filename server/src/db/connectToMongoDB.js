import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

const connectToMongoDB = async () => {

    try {
        console.log("Attempting to connect to database.....");
        await mongoose.connect(MONGO_URL, {});
        console.log("Connected to database.....");

    } catch (error) {
        console.log("Failed to connect to database.....", error.message);
        process.exit(1);
    }
};

export default connectToMongoDB;