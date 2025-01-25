import React, { useState } from 'react';
import { Image, X } from 'lucide-react';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // In a real app, this would be handled by the backend
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 rounded-lg border focus:outline-none focus:border-indigo-500 resize-none"
          rows={3}
        />

        {showImageInput && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
                className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl('');
                  setShowImageInput(false);
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="mt-4 rounded-lg max-h-64 object-cover"
              />
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={() => setShowImageInput(true)}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
          >
            <Image className="h-5 w-5" />
            <span>Add Image</span>
          </button>

          <button
            type="submit"
            disabled={!content.trim()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}