import mongoose from 'mongoose';
import { IPost } from '../types/models';

const postSchema = new mongoose.Schema<IPost>({
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  likes: {
    type: [String],
    required: false,
    default: []
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  comments: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
    default: []
  },
  createdAt: {
    type: String,
    required: true,
    default: new Date().toISOString()
  }
}, {
  timestamps: true
});

export const Post = mongoose.model<IPost>('Post', postSchema);
