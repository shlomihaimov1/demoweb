import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, MapPin, Calendar } from 'lucide-react';
import { mockUsers, mockPosts } from '../data/mockData';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import Chat from '../components/Chat';

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [showChat, setShowChat] = useState(false);
  
  const user = mockUsers.find(u => u.id === id) || mockUsers[0];
  const userPosts = mockPosts.filter(post => post.userId === id);
  const isOwnProfile = id === '1';

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20 mb-4">
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              
              <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">@{user.username}</p>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={() => setShowChat(true)}
                  className="ml-auto mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Message
                </button>
              )}
            </div>

            <p className="text-gray-700 mb-4">{user.bio}</p>

            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>New York, USA</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined March 2024</span>
              </div>
            </div>

            <div className="flex space-x-6 border-t border-b py-4">
              <div>
                <span className="font-bold">{user.followers}</span>
                <span className="text-gray-600 ml-1">Followers</span>
              </div>
              <div>
                <span className="font-bold">{user.following}</span>
                <span className="text-gray-600 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {isOwnProfile && <CreatePost />}
          
          {userPosts.map(post => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>

      {showChat && (
        <Chat user={user} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
}