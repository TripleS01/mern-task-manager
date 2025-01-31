import bcrypt from 'bcryptjs';

import User from "../models/userModel.js";
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const register = async (request, response) => {

    try {
        const { username, password, repeatPassword, gender } = request.body;

        if (password !== repeatPassword) {
            return response.status(400).json({ error: 'Passwords do not match' });
        }

        const user = await User.findOne({ username });
        if (user) {
            return response.status(400).json({ error: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassowrd = await bcrypt.hash(password, salt);

        const boyProfilePicture = 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Angel';
        const girlProfilePicture = 'https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Zoe';

        const newUser = new User({
            username,
            password: hashedPassowrd,
            gender,
            profilePicture: gender === 'male' ? boyProfilePicture : girlProfilePicture,
        });

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, response);

            await newUser.save();

            response.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                profilePicture: newUser.profilePicture,
            });

        } else {
            response.status(400).json({ error: 'Invalid user data' });
        }

    } catch (error) {
        console.log('Error is in register controller:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (request, response) => {

    try {
        const { username, password } = request.body;
        const user = await User.findOne({ username });

        const isPassowrdCorrect = await bcrypt.compare(password, user?.password || '');
        if (!user || !isPassowrdCorrect) {
            return response.status(400).json({ error: 'Invalid username or password' });
        };

        generateTokenAndSetCookie(user._id, response);

        response.status(201).json({
            _id: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
        });


    } catch (error) {
        console.log('Error is in login controller:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = (request, response) => {

    try {
        response.cookie('jwt', '', { maxAge: 0 });
        response.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.log('Error is in logout controller:', error.message);
        response.status(500).json({ error: 'Internal server error' });
    }
};