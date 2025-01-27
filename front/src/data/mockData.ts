import { User, Post, Message } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    name: 'John Doe',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Software developer by day, photographer by night',
    followers: 1234,
    following: 423
  },
  {
    id: '2',
    username: 'janedoe',
    name: 'Jane Doe',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Travel enthusiast | Food lover',
    followers: 2345,
    following: 345
  }
];

export const mockPosts: Post[] = [
  {
    _id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Just finished building my first React app! 🚀',
    image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600',
    likes: ['2'],
    comments: [
      {
        id: '1',
        userId: '2',
        user: mockUsers[1],
        content: 'Looks amazing! Great work!',
        createdAt: '2024-03-10T10:00:00Z'
      }
    ],
    createdAt: '2024-03-10T09:00:00Z'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    content: 'Hey, how are you?',
    createdAt: '2024-03-10T08:00:00Z'
  }
];