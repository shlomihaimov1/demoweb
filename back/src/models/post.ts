import mongoose from 'mongoose';
import { IPost } from '../types/models';

const postSchema = new mongoose.Schema<IPost>({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

export const Post = mongoose.model<IPost>('Post', postSchema);
