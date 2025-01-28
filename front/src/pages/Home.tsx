import React, { useEffect, useState } from 'react';
import { Post as PostType } from '../types';

// Services
import { fetchPosts } from '../services/postService';

// Components
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

export default function Home() {

  const [postsArray, setPostsArray] = useState<PostType[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const result = await fetchPosts();
      if(result?.status == 200) {
        setPostsArray(result.data);
        console.log(result.data);
      }
      else {
        console.log("Error fetchin posts")
      };

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-2xl mx-auto px-4">
        <CreatePost />

        <div className="space-y-6 pb-6">
          {postsArray.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
