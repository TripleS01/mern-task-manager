import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const generateToken = (userId) => {

    return jwt.sign({ userId }, JWT_SECRET_KEY, {
        expiresIn: "14d",
    });
};
export default generateToken;