import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { IComment } from '../types/models';
import { Comment } from '../models/comment';


const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const commentData = {
            ...req.body,
            userId: userId
        }

        const comment = await Comment.create(commentData);
        
        res.status(200).json(comment);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

const getPostComments = async (req: Request, res: Response): Promise<void> => {
    try {
        const postId = new mongoose.Types.ObjectId(req.params.id);
        const comments = await Comment.find({ postId });
        
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = req.params.id;
        const userId = req.params.userId;
        const updateData: Partial<IComment> = req.body;

        const comment = await Comment.findOneAndUpdate(
            { _id: commentId, userId: userId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!comment) {
            res.status(404).json({ message: 'Comment not found or user not authorized' });
            return;
        }
        
        res.json(comment);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const commentId = req.params.id;
        const userId = req.params.userId;
        const comment = await Comment.findById(commentId);
        
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }

        if (comment.userId.toString() !== userId) {
            res.status(403).json({ message: 'User not authorized to delete this comment' });
            return;
        }

        await Comment.deleteOne({ _id: commentId });
        
        res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

export {
    createComment,
    getPostComments,
    updateComment,
    deleteComment
};