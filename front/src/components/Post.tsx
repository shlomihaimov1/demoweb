import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share } from 'lucide-react';
import { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.likes.includes('1'));
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // In a real app, this would be handled by the backend
    setNewComment('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Link to={`/profile/${post.user.id}`}>
            <img
              src={post.user.profilePicture}
              alt={post.user.name}
              className="w-10 h-10 rounded-full mr-3"
            />
          </Link>
          <div>
            <Link to={`/profile/${post.user.id}`}>
              <h3 className="font-semibold">{post.user.name}</h3>
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <p className="mb-4">{post.content}</p>
        
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex items-center justify-between border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${
              isLiked ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>{post.likes.length + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post.comments.length}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-500">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t p-4">
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="space-y-4">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img
                  src={comment.user.profilePicture}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Link to={`/profile/${comment.user.id}`}>
                      <span className="font-semibold">{comment.user.name}</span>
                    </Link>
                    <p>{comment.content}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}