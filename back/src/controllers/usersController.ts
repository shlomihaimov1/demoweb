import { Request, Response } from 'express';
import { User } from '../models/user';
import { Post } from '../models/post';
import { Comment } from '../models/comment';
import fs from 'fs';
import path from 'path';

interface GetUsersQuery extends Request {
    query: {
        username?: string;
    };
}

export const getAllUsers = async (req: GetUsersQuery, res: Response): Promise<void> => {
    try {
        const users = await User.find()
            .select('-password') // Exclude password from results
            .sort({ username: 1 }); // Sort by username alphabetically

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.body.id;
        let { username, profilePicture, email } = req.body;

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Don't process file operations if dealing with default avatar
        if (currentUser.profilePicture !== '/images/default.avif' && profilePicture !== '/images/default.avif') {
            const oldFilePath = path.join(path.resolve(), '..', 'front', 'public', 'images', `${currentUser.email}.jpg`);
            const newFilePath = path.join(path.resolve(), '..', 'front', 'public', 'images', `${email}.jpg`);
            
            if (fs.existsSync(oldFilePath)) {
                fs.renameSync(oldFilePath, newFilePath);
            }
        }

        // Update user in database
        const user = await User.findByIdAndUpdate(
            userId,
            {
                username,
                profilePicture: `/images/${profilePicture.split('/').pop()}`
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Delete all posts related to the user
        await Post.deleteMany({ userId: userId });

        // Delete all comments related to the user
        await Comment.deleteMany({ userId: userId });

        res.json({
            message: 'User and related posts and comments deleted successfully',
            userId: user._id
        });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
