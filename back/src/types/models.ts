import mongoose from "mongoose";
  
export interface IUser {
    _id?: string;
    username: string;
    email: string;
    password: string;
    profilePicture: string;
    refreshToken?: string[];
}
  
export interface IPost {
    _id?: string;
    user: mongoose.Schema.Types.Mixed;
    content: string;
    likes: [string]; 
    userId: string;
    image: string;
} 
  
export interface IComment {
    _id?: string;
    postId: mongoose.Schema.Types.ObjectId;
    content: string;
    userId: string;
}