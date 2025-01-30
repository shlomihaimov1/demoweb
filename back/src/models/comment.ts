import mongoose from 'mongoose';
import { IComment } from '../types/models';

const commentSchema = new mongoose.Schema<IComment>({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
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

export const Comment = mongoose.model<IComment>('Comment', commentSchema);