import React, { useEffect, useState } from 'react';
import { createPost } from '../services/postService';
import { Image, X } from 'lucide-react';
import { updateImage } from '../services/globalService';
import { generatePostContent } from "../services/geminiService";

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(new Blob());
  const [imageName, setImageName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const user = {
    name: localStorage.getItem('username') || '',
    profilePicture: localStorage.getItem('profilePicture') || '',
  };

  const handleUpload = async(e: any) => {
    e.preventDefault();
    
    const imgFileName = e.target.files[0].name.split('.')[0];
    const fileExtension = e.target.files[0].name.split('.').pop();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `${user.name.replace(/\s+/g, '_')}-${imgFileName.replace(/\s+/g, '_')}-${timestamp}.${fileExtension}`;

    setImageName(fileName);
    setImageFile(e.target.files[0]);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
  
    try {
      const formData = new FormData();
      
      // Try first uploading the image
      formData.append('image', imageFile, imageName);
      const result = await updateImage(formData);
      
      // Create the post
      if(result?.status === 200) {
        formData.delete("image");

        formData.append('user', JSON.stringify(user));
        formData.append('content', content);
        formData.append('image', "/images/" + imageName);

        await createPost(formData);
        window.location.reload();
      }
    }
    catch (error) {
      console.error('Error creating post:', error);
      alert('Something went wrong while creating the post, Please try again later');
    }

    // Clean the new post form
    setImageFile(new Blob());
    setImageName('');
    setContent('');
  };

  const handleAIHelper = async () => {
    const prompt = window.prompt("What kind of post would you like to create?");
    if (!prompt) return;

    setIsGenerating(true);
    try {
      const generatedContent = await generatePostContent(prompt);
      setContent(generatedContent);
    } catch (error) {
      console.error('Error using AI helper:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 mt-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isGenerating ? "Generating content..." : "What's on your mind?"}
            className="w-full p-4 rounded-lg border focus:outline-none focus:border-indigo-500 resize-none"
            rows={3}
            disabled={isGenerating}
          />
          <button
            type="button"
            onClick={handleAIHelper}
            disabled={isGenerating}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            Use AI Helper
          </button>
        </div>

        {imageFile.size > 0 && (
          <div className="mt-4">
            <button
                type="button"
                onClick={() => {
                  setImageFile(new Blob());
                  setImageName('');
                }}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>

            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-4 rounded-lg max-h-64 object-cover mx-auto"
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          
          <button
            type="button"
            onClick={() => { window.document.getElementById('file-upload')?.click(); }}
            className="flex items-center space-x-2 text-gray-500 hover:text-gray-700" >
            <Image className="h-5 w-5" />
            <span>Add Image</span>
          </button>
          
          <input type="file" id="file-upload" name="image" accept=".png, .jpeg, .jpg" onChange={handleUpload} />

          <button type="submit" disabled={!content.trim() || imageName === ""}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          > Post </button>

        </div>
      </form>
    </div>
  );
}
