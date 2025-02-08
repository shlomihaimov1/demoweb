import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login, googleLogin } from '../services/authService';
import { GoogleLogin } from '@react-oauth/google';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login(email, password);
      if(result?.status === 200) {
        window.location.href = '/home';        
      }
      else {
        alert('Invalid email or password');
      };
    }
    catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in');
    };
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Login to ShareIt</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Login
            </button>
          </form>

          <div className="mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const result = await googleLogin(credentialResponse);
                if(result?.status === 200) {
                  window.location.href = '/home';
                }
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </div>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}