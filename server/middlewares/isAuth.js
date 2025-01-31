import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from '../models/userModel.js';

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const isAuth = async (request, response, next) => {

    try {
        const token = request.cookies.jwt;
        if (!token) {
            return response.status(401).json({ error: 'Unauthorized - No Token Provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        if (!decoded) {
            return response.status(401).json({ error: 'Unauthorized - Invalid Token' });
        }

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        request.user = user;

        next();

    } catch (error) {
        console.log('Error in isAuth middleware: ', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }

};

export default isAuth;