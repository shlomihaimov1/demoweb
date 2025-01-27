export interface User {
  id: string;
  username: string;
  name: string;
  profilePicture: string;
  bio: string;
  followers: number;
  following: number;
}

export interface Post {
  _id: string;
  userId: string;
  user: User;
  content: string;
  image?: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}