import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectToMongoDB from './db/connectToMongoDB.js';
import router from './routes.js';

dotenv.config();
const PORT_URL = process.env.PORT_URL;
const CLIENT_CORS_URL = process.env.REACT_CORS_URL;

const app = express();

app.use(cors({
    credentials: true,
    origin: CLIENT_CORS_URL,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', router);

const server = async () => {
    try {
        await connect();

        app.listen(port, () => {
            console.log(`Server is running on port ${PORT_URL}`);
        });
    } catch (error) {
        console.log("Failed to strt server.....", error.message);
        process.exit(1);
    }
};

server();