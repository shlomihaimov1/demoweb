import React from 'react';
import { mockPosts } from '../data/mockData';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-2xl mx-auto px-4">
        <CreatePost />
        
        <div className="space-y-6">
          {mockPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}