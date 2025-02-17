import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user'; // Ensure correct import of User model
import { verifyRefreshToken } from '../controllers/authController';
import { Document } from 'mongoose'; // Import Mongoose's Document type

// Define Payload type for JWT verification
type Payload = {
    _id: string;
};

// Extend Express Request Interface
declare global {
    namespace Express {
        interface Request {
            user?: Document & Omit<typeof User.prototype, 'password'>; // Mongoose Document without password
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !req.headers['x-refresh-token']) {
        return res.status(401).json({ message: 'No token provided' });
    }
    if (!process.env.TOKEN_SECRET) {
        return res.status(500).send('Server Error');
    }

    const token = authHeader.split(' ')[1];

    try {
        // Extract refresh token properly
        const refreshToken = Array.isArray(req.headers['x-refresh-token']) 
            ? req.headers['x-refresh-token'][0] 
            : req.headers['x-refresh-token'];

        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
            return res.status(400).send("User not logged in");
        }

        jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
            if (err) {
                return res.status(401).send('Access Denied');
            }

            const userId = (payload as Payload)._id;
            const foundUser = await User.findById(userId).select('-password'); // Exclude password field

            if (!foundUser) {
                return res.status(401).send('User not found');
            }

            req.user = foundUser;
            next();
        });
    } catch (err) {
        return res.status(400).send("fail");
    }
};
