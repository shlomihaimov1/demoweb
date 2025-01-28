import mongoose from 'mongoose';
import { IUser } from '../types/models';

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: false,
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
  },
  city: {
    type: String,
    required: false
  },
  country: {
    type: String,
    required: false
  },
  month: {
    type: String,
    required: false
  },
  year: {
    type: String,
    required: false
  }
});


export const User = mongoose.model<IUser>('User', userSchema);
