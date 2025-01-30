import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Types
import { Post as PostType } from '../types';

// Services
import { updateImage } from '../services/globalService';
import { updatePost, deletePost, likePost } from '../services/postService';
import { createComment, fetchComments, updateComment, deleteComment } from '../services/commentService';

// Icons
import { Heart, MessageCircle, Share, Settings2, Edit, Trash, Image, X } from 'lucide-react';

interface PostProps {
  post: PostType;
}

export default function Post({ post }: PostProps) {

  // User info
  const [userInfo] = useState(post?.user ? JSON.parse(post.user) : {});
  const userID = localStorage.getItem('_id') || '';
  const user = {
    name: localStorage.getItem('username') || '',
    profilePicture: localStorage.getItem('profilePicture') || '',
  };

  // Post
  const [showPostSettings, setShowPostSettings] = useState(false);
  const [editedPostID, setEditedPostID] = useState('');
  const [isPostCurrentlyEdited, setIsPostCurrentlyEdited] = useState(false);
  const [postNewContent, setPostNewContent] = useState(post.content);
  const [postNewImage, setPostNewImage] = useState(new Blob());
  const [postNewImageName, setPostNewImageName] = useState("");

  // Likes
  const [isLiked, setIsLiked] = useState(false);
  const [likeNum, setLikeNum] = useState<number>(post.likes.length);
  
  // Comments
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState<any>([]);
  const [showCommentSettings, setShowCommentSettings] = useState(false);
  const [editedCommentID, setEditedCommentID] = useState('');
  const [editedComment, setEditedComment] = useState('');
  const [isCurrentlyEdited, setIsCurrentlyEdited] = useState(false);

  // Get comments of post
  useEffect(() => {

    const getComments = async (postId: string) => {
      const result = await fetchComments(postId);
      setPostComments(result?.data);      
    }

    getComments(post._id);
  }, [post]);
  
  // Check if the current user has liked the post 
  useEffect(() => {
    setIsLiked(post.likes.includes(userID));
  }, [post]);
  

  // Functions

  const handleLike = async () => {

    const updatedLikes = isLiked ? 
      post.likes.filter((liker) => liker !== userID) : 
      [...new Set([...post.likes, userID])];

    const postData = {
      id: post._id,
      likes: updatedLikes,
    };

    await likePost(postData);

    setIsLiked(!isLiked);
    setLikeNum(isLiked ? likeNum - 1 : likeNum + 1);
  };

  const handleNewComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const formData = new FormData();
    
    formData.append('user', JSON.stringify(user)); // Comment Sender
    formData.append('postId', post._id); // Post ID to comment on
    formData.append('content', newComment); // Comment content

    const result = await createComment(formData);
    
    // In a real app, this would be handled by the backend
    setNewComment('');

    if(result?.status === 200) {
      window.location.href = `/home#${post._id}`;
      window.location.reload();
    }
    else {
      console.error('Error creating comment:', result);
      alert('Something went wrong while creating your comment. Please try again later.');
    }
  };

  const handleUpdateComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedComment.trim()) return;

    const formData = new FormData();
    
    formData.append('user', JSON.stringify(user)); // Comment Sender
    formData.append('commentId', editedCommentID); // Comment ID to edit
    formData.append('content', editedComment); // Comment content

    const result = await updateComment(formData);

    if(result?.status === 200) {
      window.location.href = `/home#${post._id}`;
      window.location.reload();
    }
    else {
      console.error('Error updating comment:', result);
      alert('Something went wrong while updating your comment. Please try again later.');
    }
  }

  const handleDeleteComment = async () => {
    const result = await deleteComment(editedCommentID);

    if(result?.status === 200) {
      window.location.href = `/home#${post._id}`;
      window.location.reload();
    }
    else {
      console.error('Error deleting comment:', result);
      alert('Something went wrong while deleting your comment. Please try again later.');
    }
  }

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      // Try first uploading the new image
      let result;

      if(postNewImageName !== "") {
        formData.append('image', postNewImage, postNewImageName);
        result = await updateImage(formData);
        formData.delete("image");
      }

      // Update the post content
      if(postNewImageName === "" || result?.status === 200) {
        console.log(editedPostID)
        formData.append('id', editedPostID);
        formData.append('user', JSON.stringify(user));
        formData.append('content', postNewContent);

        if(postNewImageName !== "") {
          formData.append('image', "/images/" + postNewImageName);
        }

        const result = await updatePost(formData);
        if(result?.status === 200) {
          setIsPostCurrentlyEdited(false);
          setPostNewImageName('');
          setPostNewImage(new Blob());
          setPostNewContent(post.content);
    
          window.location.href = `/home#${post._id}`;
          window.location.reload();
        }
        else {
          console.error('Error updating post:', result);
          alert('Something went wrong while updating your post. Please try again later.');
        }
      }
    }
    catch (error) {
      console.error('Error updating post:', error);
      alert('Something went wrong while updating the post, Please try again later');
    }

  }
  
  const handleDeletePost = async () => {
    const result = await deletePost(editedPostID);

    if(result?.status === 200) {
      window.location.href = `/home`;
      window.location.reload();
    }
    else {
      console.error('Error deleting post:', result);
      alert('Something went wrong while deleting your post. Please try again later.');
    }
  }

  // Upload New Post Image
  const handleUpload = async(e: any) => {
    e.preventDefault();
    
    const imgFileName = e.target.files[0].name.split('.')[0];
    const fileExtension = e.target.files[0].name.split('.').pop();
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;
    const fileName = `${user.name.replace(/\s+/g, '_')}-${imgFileName.replace(/\s+/g, '_')}-${timestamp}.${fileExtension}`;

    setPostNewImageName(fileName);
    setPostNewImage(e.target.files[0]);
  }
  

  return (
    <div id={post._id} className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">

          <div className="flex items-center mb-4">
            <Link to={`/profile/${post.userId}`}>
              <img
                src={userInfo.profilePicture}
                key={userInfo.profilePicture}
                alt={userInfo.name}
                className="w-10 h-10 rounded-full mr-3"
              />
            </Link>
            <div>
              <Link to={`/profile/${post.userId}`}>
                <h3 className="font-semibold">{userInfo.name}</h3>
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {post.userId === userID && (
              <div>
                <button onClick={() => {
                      setEditedPostID(post._id);
                      setShowPostSettings(!showPostSettings) 
                    }
                  } className="flex items-center space-x-2 text-gray-500">
                  <Settings2 className="h-5 w-5" />
                </button>

                {showPostSettings && post._id === editedPostID && (
                  <div className='absolute bg-white shadow-md p-2 rounded-lg space-y-2' style={{ marginLeft: '-20px' }}>
                      <button onClick={() => setIsPostCurrentlyEdited(!isCurrentlyEdited)} 
                      className="flex items-center space-x-2 text-gray-500 hover:bg-gray-200 p-1 rounded"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      <button onClick={handleDeletePost} 
                      className="flex items-center space-x-2 text-gray-500 hover:bg-gray-200 p-1 rounded"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                
                  </div>
                )}

              </div> 
          )}
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
            <span>{likeNum}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-gray-500"
          >
            <MessageCircle className="h-5 w-5" />
            <span>{postComments.length}</span>
          </button>

          {/* <button className="flex items-center space-x-2 text-gray-500">
            <Share className="h-5 w-5" />
          </button> */}
        </div>
      </div>

      {/* Comment Displayer */}
      {showComments && (
        <div className="border-t p-4">
          <form onSubmit={handleNewComment} className="mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
            />
          </form>

          <div className="space-y-4">
            {postComments.length > 0 && postComments.map((comment: any) => (
              <div key={comment._id} id={comment._id} className="flex items-start space-x-3">
                
                {/* Comment Creator */}
                <img
                  src={comment?.user ? JSON.parse(comment.user).profilePicture : ""}
                  alt={comment?.user ? JSON.parse(comment.user).name : ""}
                  className="w-8 h-8 rounded-full"
                />
                
                <div className='bg-gray-100 w-full p-2 rounded-lg flex items-start space-x-3'>

                  {/* Comment Content */}
                  <div className="flex-1">

                    <div className="rounded-lg p-3">
                      <Link to={`/profile/${comment.userId}`}>
                        <span className="font-semibold">{comment?.user ? JSON.parse(comment.user).name : ""}</span>
                      </Link>

                        {comment.userId === userID && comment._id === editedCommentID && isCurrentlyEdited ? (
                          <form onSubmit={(e) => handleUpdateComment(e)} className="mb-4">
                            <input
                            type="text"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            placeholder="Edit your comment..."
                            className="mt-2 w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                            />
                          </form>
                        ) : (
                          <p>{comment.content}</p>
                        )}

                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>

                  </div>

                  {/* Edit / Delete - Display only for creator */}
                  {comment.userId === userID && (
                    <div>
                      <button onClick={() => {
                          setEditedCommentID(comment._id);
                          setShowCommentSettings(!showCommentSettings) }
                        } className="flex items-center space-x-2 text-gray-500">
                        <Settings2 className="h-5 w-5" />
                      </button>
                      
                      
                      {showCommentSettings && comment._id === editedCommentID && (
                        <div className='absolute bg-white shadow-md p-2 rounded-lg space-y-2' style={{ marginLeft: '-20px' }}>
                            <button onClick={() => setIsCurrentlyEdited(!isCurrentlyEdited)} 
                            className="flex items-center space-x-2 text-gray-500 hover:bg-gray-200 p-1 rounded"
                            >
                              <Edit className="h-5 w-5" />
                            </button>

                            <button onClick={handleDeleteComment} 
                            className="flex items-center space-x-2 text-gray-500 hover:bg-gray-200 p-1 rounded"
                            >
                              <Trash className="h-5 w-5" />
                            </button>
                      
                        </div>
                      )}

                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Edit */}
      {isPostCurrentlyEdited && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#35343466', display: 'flex' }}>
          
          {/* Edit Post Form */}
          <form onSubmit={handleUpdatePost} style={{ position: 'relative',margin: 'auto', width: '75%', background: '#ededed', padding: '6%', borderRadius: '25px' }}>
            
            {/* Quit Post Edit */}
            <button type="button"
              onClick={() => {
                setIsPostCurrentlyEdited(false);
              }}
              className="p-2 text-red-500 hover:bg-gray-100 rounded-full"
              style={{ position: 'absolute', top: '-32px', right: '-32px' }}
            >
              <X className="h-7 w-7" />
            </button>
            
            <textarea
              value={postNewContent}
              onChange={(e) => setPostNewContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-4 rounded-lg border focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
            />

            <div className="mt-4 relative">

              {postNewImageName !== "" && (
                <button type="button" onClick={() => {
                    setPostNewImage(new Blob());
                    setPostNewImageName('');
                  }}
                  className="p-4 text-red-500 hover:bg-black rounded-full font-bold"
                  style={{ position: 'absolute', top: '32%', left: '43%' }}
                >
                  <X className="h-8 w-8" />
                </button>
              )}

              <img
                src={postNewImageName === "" ? post.image : URL.createObjectURL(postNewImage)}
                alt="Preview"
                className="mt-4 rounded-lg max-h-40 object-cover mx-auto"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              
              <button
                type="button"
                onClick={() => { window.document.getElementById('new-image-upload')?.click(); }}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700" >
                <Image className="h-5 w-5" />
                <span>Replace Image</span>
              </button>
              
              <input type="file" id="new-image-upload" name="image" accept=".png, .jpeg, .jpg" onChange={handleUpload} />

              <button type="submit" disabled={!postNewContent.trim() && postNewImageName === ""}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              > Update Post </button>

            </div>
          </form>
        </div>
      )}
    </div>
  );
}
