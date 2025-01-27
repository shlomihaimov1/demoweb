import mongoose from 'mongoose';
import { IUser } from '../types/models';

const userSchema = new mongoose.Schema<IUser>({
  username: { 
    type: String, 
    required: true,
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  profilePicture: {
    type: String,
    required: false
  },
  refreshToken: {
    type: [String],
    default: [],
  }
});


export const User = mongoose.model<IUser>('User', userSchema);
