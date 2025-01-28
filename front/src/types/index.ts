export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  refreshToken?: string[];
  city: string;
  country: string;
  month: string;
  year: string;
}

export interface Post {
  _id: string;
  user: any;
  content: string;
  likes: [string];
  userId: string;
  image: string;
  createdAt: string;
  comments: [any];
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
  receiverId: any;
  content: string;
  createdAt: string;
}
