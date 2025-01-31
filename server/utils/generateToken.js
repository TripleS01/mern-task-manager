import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV;

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, JWT_SECRET_KEY, {
        expiresIn: "14d",
    });

    res.cookie("jwt", token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: NODE_ENV !== "development",
    });
};

export default generateTokenAndSetCookie;