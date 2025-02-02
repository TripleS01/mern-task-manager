import bcrypt from 'bcryptjs';

import User from "../models/userModel.js";
import generateToken from '../utils/generateToken.js';

export const registerUser = async (request, response) => {

    try {
        const { email, username, password, repeatPassword } = request.body;

        if (!username || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
        }

        if (password !== repeatPassword) {
            return response.status(400).json({ error: 'Passwords do not match!' });
        }

        const userExists = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
            ]
        });;
        if (userExists) {
            return response.status(400).json({ error: 'User already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassowrd = await bcrypt.hash(password, salt);

        const newUser = new User.create({
            username,
            email,
            password: hashedPassowrd,
        });

        const token = generateToken(newUser._id);

        response.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: false,
        });

        if (newUser) {
            const { _id, name, email, role, photo, bio, isVerified } = newUser;

            response.status(201).json({
                _id,
                name,
                email,
                role,
                photo,
                bio,
                isVerified,
                token,
            });

        } else {
            response.status(400).json({ message: "Invalid user data!" });
        }

    } catch (error) {
        console.log('Error is in register controller:', error.message);
        response.status(500).json({ error: 'Internal server error!' });
    }
};

export const loginUser = async (request, response) => {

    try {
        const { identifier, password } = request.body;
        const userExists = await User.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
            ]
        });

        if (!identifier || !password) {
            return response.status(400).json({ error: 'Invalid username/email or password!' });
        };

        const isMatch = await bcrypt.compare(password, userExists?.password || '');
        if (!isMatch) {
            return response.status(400).json({ message: "Invalid credentials!" });
        }

        const token = generateToken(userExists._id);

        if (userExists && isMatch) {
            const { _id, name, email, role, photo, bio, isVerified } = userExists;

            response.cookie("token", token, {
                path: "/",
                httpOnly: true,
                maxAge: 14 * 24 * 60 * 60 * 1000,
                sameSite: "none",
                secure: true,
            });

            response.status(200).json({
                _id,
                name,
                email,
                role,
                photo,
                bio,
                isVerified,
                token,
            });

        } else {
            response.status(400).json({ message: "Invalid email or password!" });
        }

    } catch (error) {
        console.log('Error is in login controller:', error.message);
        response.status(500).json({ error: 'Internal server error!' });
    }
};

export const logoutUser = (request, response) => {

    try {
        response.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            path: "/",
        });

        response.status(200).json({ message: "User logged out" });

    } catch (error) {
        console.log('Error is in logout controller:', error.message);
        response.status(500).json({ error: 'Internal server error!' });
    }
};