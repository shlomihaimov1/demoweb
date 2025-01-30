import { Request, Response } from 'express';
import { IPost } from '../types/models';

import { Post } from '../models/post';
import { Comment } from '../models/comment';

import fs from 'fs';
import path from 'path';

// Extend Request to include body typing
interface PostRequest extends Request {
    body: Omit<IPost, '_id'>;
}

interface GetPostsQuery extends Request {
    query: {
        sender?: string;
    };
}

const createPost = async (req: PostRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;
        const postData = {
            ...req.body,
            userId: userId
        };

        const post = await Post.create(postData);
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

const getAllPosts = async (req: GetPostsQuery, res: Response): Promise<void> => {
    try {
        const { sender } = req.query;
        let posts: IPost[];

        if (sender) {
            posts = await Post.find({ userId: sender });
        } else {
            posts = await Post.find();
        }

        res.json(posts.reverse());
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

const getPostById = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const getPostByUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({_id: req.params.user});

        if (!posts) {
            res.status(404).json({ message: 'Posts not found' });
            return;
        }

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const updateData: Partial<IPost> = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        // Check if the only update is 'likes'
        const isAllowedUpdate = Object.keys(updateData).length === 2 && updateData.hasOwnProperty('likes');

        if (!isAllowedUpdate && post.userId.toString() !== req.params.userId) {
            res.status(403).json({ message: 'You are not authorized to update this post' });
            return;
        }
        if (!isAllowedUpdate && post.userId.toString() !== req.params.userId) {
            res.status(403).json({ message: 'You are not authorized to update this post' });
            return;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        if (post.userId.toString() !== req.params.userId) {
            res.status(403).json({ message: 'You are not authorized to delete this post' });
            return;
        }

        await Post.findByIdAndDelete(req.params.id);

        // Delete all comments related to the post
        await Comment.deleteMany({ postId: req.params.id });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};

export {
    createPost,
    getAllPosts,
    getPostById,
    getPostByUser,
    updatePost,
    deletePost,
};
