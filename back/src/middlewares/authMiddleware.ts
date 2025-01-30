import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyRefreshToken } from '../controllers/authController';

type Payload = {
    _id: string;
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ') || !req.headers['x-refresh-token']) {
        return res.status(401).json({ message: 'No token provided' });
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server Error');
        return;
    }

    const token = authHeader.split(' ')[1];

    // Check if user is logged in
    try {
        const refreshToken = Array.isArray(req.headers['x-refresh-token']) ? req.headers['x-refresh-token'][0] : req.headers['x-refresh-token'];
        const user = await verifyRefreshToken(refreshToken);
        if (!user) {
            res.status(400).send("User not logged in");
            return;
        }
    } catch (err) {
        res.status(400).send("fail");
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
        if (err) {
            res.status(401).send('Access Denied');
            return;
        }
    
        req.params.userId = (payload as Payload)._id;
        next();
    });
};
