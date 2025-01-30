import { Request, Response } from 'express';
import { User } from '../models/user';
import { IUser } from '../types/models';
import { authMiddleware } from '../middlewares/authMiddleware';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

const getCurrentMonthAndYear = (): { month: string, year: number } => {
    const date = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return { month, year };
};

// Handle user operations
const register = async (req: Request, res: Response) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const profilePicture = req.body.profilePicture ? `/images/${req.body.profilePicture}` : "/images/default.avif";
        const { month, year } = getCurrentMonthAndYear();

        const user = await User.create({
            email: req.body.email,
            username: req.body.username,
            password: hashedPassword,
            profilePicture: profilePicture,
            city: req.body.city,
            country: req.body.country,
            month: month,
            year: year
        });

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

const login = async (req: Request, res: Response) => {
    try {

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            res.status(400).send('wrong username or password');
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            res.status(400).send('wrong username or password');
            return;
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(500).send('Server Error');
            return;
        }

        // Generate a token
        const tokens = generateToken(user._id);
        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }

        user.refreshToken.push(tokens.refreshToken);
        await user.save();

        res.status(200).send({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture
        });

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
};

const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            res.status(400).send("fail");
            return;
        }

        if (!process.env.TOKEN_SECRET) {
            res.status(500).send("Server Error");
            return;
        }

        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                res.status(400).send("fail");
                return;
            }

            const userId = payload._id;
            try {
                const user = await User.findById(userId);
                if (!user) {
                    res.status(400).send("fail");
                    return;
                }

                user.refreshToken = [];
                await user.save();

                res.status(200).send("success");
            } catch (err) {
                res.status(400).send("fail");
            }
        });
    } catch (err) {
        res.status(400).send("fail");
    }
};

const verify = async (req: Request, res: Response) => {
    try {
        res.status(200).send("success");
    } catch (err) {
        res.status(400).send("fail");
    }
};

// Handle Tokens

type tTokens = {
    accessToken: string,
    refreshToken: string
}

const generateToken = (userId: string): tTokens | null => {
    if (!process.env.TOKEN_SECRET) {
        return null;
    }
    // generate token
    const random = Math.random().toString();
    const accessToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRES });

    const refreshToken = jwt.sign({
        _id: userId,
        random: random
    },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
};

const refresh = async (req: Request, res: Response) => {
    try {
        const user = await verifyRefreshToken(req.body.refreshToken);
        if (!user) {
            res.status(400).send("fail");
            return;
        }
        const tokens = generateToken(user._id);

        if (!tokens) {
            res.status(500).send('Server Error');
            return;
        }
        if (!user.refreshToken) {
            user.refreshToken = [];
        }
        user.refreshToken.push(tokens.refreshToken);
        await user.save();
        res.status(200).send(
            {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                _id: user._id
            });
        //send new token
    } catch (err) {
        res.status(400).send("fail");
    }
};

type tUser = Document<unknown, {}, IUser> & IUser & Required<{
    _id: string;
}> & {
    __v: number;
}
const verifyRefreshToken = (refreshToken: string | undefined) => {
    return new Promise<tUser>((resolve, reject) => {

        // Get refresh token from body
        if (!refreshToken) {
            reject("fail");
            return;
        }

        // Verify token
        if (!process.env.TOKEN_SECRET) {
            reject("fail");
            return;
        }

        jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err: any, payload: any) => {
            if (err) {
                reject("fail");
                return
            }

            // Get the user id fromn token
            const userId = payload._id;
            try {
                // Get the user form the db
                const user = await User.findById(userId);

                if (!user) {
                    reject("fail");
                    return;
                }

                if (!user.refreshToken){
                    user.refreshToken = [];
                    await user.save();
                    reject("fail");
                    return;
                }

                const tokens = user.refreshToken!.filter((token) => token !== refreshToken);
                user.refreshToken = tokens;

                resolve(user);
            } catch (err) {
                reject("fail6");
                return;
            }
        });
    });
}



export {
    register,
    login,
    refresh,
    verifyRefreshToken,
    logout,
    verify
};
