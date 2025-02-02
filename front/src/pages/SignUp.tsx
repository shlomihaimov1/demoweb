import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(new Blob());
  const [imageName, setImageName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [formData, setFormData] = useState(new FormData());

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('city', city);
      formData.append('country', country);
      formData.append('profilePicture', imageName);
      formData.append('profile-pic', imageFile, imageName);

      const result = await register(formData);
      if (result?.status === 200) {
        window.location.href = '/login';
      } else {
        // Display the specific error message from the backend
        alert(result?.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error registering user');
    }
  };

  const handleUpload = async(e: any) => {

    e.preventDefault();
    const fileExtension = e.target.files[0].name.split('.').pop();
    const fileName = `${email}.${fileExtension}`;

    await setImageName(fileName);
    await setImageFile(e.target.files[0]);

  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Create an Account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>

              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                username
              </label>
              <input type="text" id="username" accept=".png, .jpeg, .jpg" value={username} onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500" required />
            
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="City" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor="Country" className="block text-sm font-medium text-gray-700">
              Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label htmlFor='profilePicture' className="block text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <input type = "file" id = "profilePictureRegister" onChange = {handleUpload}/>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
