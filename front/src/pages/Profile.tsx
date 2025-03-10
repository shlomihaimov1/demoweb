import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Icons
import { MessageSquare, MapPin, Calendar } from 'lucide-react';

// Types
import *  as Interfaces from '../types/index';

// Components
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';

// Services
import { postsByUser } from '../services/postService';
import { getUser, updateUser } from '../services/usersService';
import { updateImage } from '../services/globalService';

export default function Profile() {
  const id: any = localStorage.getItem('_id');

  const [showChat, setShowChat] = useState(false);
  const [userPosts, setUserPosts] = useState<Interfaces.Post[]>([]);
  const [user, setUser] = useState<Interfaces.User | null>(null);
  const [imageFile, setImageFile] = useState(new Blob());
  const [imageName, setImageName] = useState('');
  const [username, setUsername] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedImage, setUpdatedImage] = useState(false);

  const location = useLocation();

  const profileID = location.pathname.split('/')[location.pathname.split('/').length - 1];
  const isOwnProfile = profileID === id;

  useEffect(() => {
    getUserDetails(profileID)
    getPosts();
    setEditMode(false);
  }, [profileID]);

  // Reroute user to chat page
  useEffect(() => {
    if (showChat) {
      window.location.href = `/chat?id=${profileID}`;
    }
  }, [showChat]);

  const getUserDetails = async (profileID: string) => {

    try {
      const result = await getUser(profileID);
      if(result?.status == 200) {
        setUser(result.data);
        setUsername(result.data.username);
        setImageName(result.data.profilePicture);
      }
      else {
        console.log("Error fetchin user")
      };

    } catch (error) {
      console.error('Error fetching user:', error);
      alert(error);
    }

  }

  const getPosts = async () => {
    try {
      const result = await postsByUser(profileID);
      if(result?.status == 200) {
        setUserPosts(result.data);
      }
      else {
        console.log("Error fetchin posts")
      };

    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEditMode(false);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('username', username);
    formData.append('profilePicture', imageName);

    const response = await updateUser(formData);

    if (updatedImage) {
      formData.delete("username");
      formData.delete("id");
      formData.delete("profilePicture");
      formData.append('image', imageFile, imageName);

      const updateImageResponse = await updateImage(formData);

      if (updateImageResponse?.status === 200) {
        localStorage.setItem('profilePicture', `/images/${imageName}`);
      }

    }

    setUpdatedImage(false);
    console.log(response?.data);

    if (response?.status === 200) {
      window.location.reload()
    } else{
      alert('Email or username are already in use');
    }
  };

  const handleUpload = async(e: any) => {

    e.preventDefault();
    const fileExtension = e.target.files[0].name.split('.').pop();
    const fileName = `${user?.email}.${fileExtension}`;

    setImageName(fileName);
    setImageFile(e.target.files[0]);
    setUpdatedImage(true);

  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white mt-4 rounded-lg shadow-md overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />

          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-20">
              {user && !editMode && (<img
                src={user.profilePicture}
                alt={user.profilePicture}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />)}
              {editMode && (
                <label>
                  <input type="file" id="file-upload" accept=".png, .jpeg, .jpg"  name="profile-pic" onChange = {handleUpload} />
                  <div className = "image-container">
                    <img
                      src={user?.profilePicture}
                      alt={user?.profilePicture}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className = "centered-text">Edit</div>
                  </div>
                </label>
              )}

              <div className="sm:ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                {!editMode && (<h1 className="text-2xl font-bold">{user?.username}</h1>)}
                {editMode && (<input type="text" value = {username} onChange={(e) => setUsername(e.target.value)} />)}
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="flex flex-row gap-4 ml-auto">
                {!isOwnProfile && (
                  <button onClick={() => setShowChat(true)}
                    className="ml-auto mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Message
                  </button>
                )}
                
                {isOwnProfile && !editMode && (
                  <button onClick={() => setEditMode(true)}
                    className="ml-auto mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  > Edit </button>
                )}
                
                {isOwnProfile && editMode && (
                  <button onClick={handleSubmit}
                    className="ml-auto mt-4 sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  > Save </button>
                )}

                {isOwnProfile && editMode && (
                  <button onClick={() => setEditMode(false)}
                    className="sm:mt-0 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  > Cancel </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-gray-600 mb-6">
              {user?.city && user?.country && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{user?.city}, {user?.country}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined {user?.month} {user?.year}</span>
              </div>
            
            </div>

            <div className="flex space-x-6 border-t border-b py-4">
              <div>
                <span className="font-bold">{userPosts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pb-6">
          {isOwnProfile && <CreatePost />}

          {userPosts.map(post => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>

    </div>
  );
}
