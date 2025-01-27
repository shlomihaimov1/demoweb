import mongoose from 'mongoose';
import { IPost } from '../types/models';
import { any } from 'prop-types';

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
  }
}, {
  timestamps: true
});

export const Post = mongoose.model<IPost>('Post', postSchema);
