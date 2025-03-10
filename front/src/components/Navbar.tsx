import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, User, LogOut, MessageCircle } from 'lucide-react';

// Interfaces
import *  as Interfaces from '../types/index';

// Services
import { fetchUsers } from '../services/usersService';
import { logout } from '../services/authService';

export default function Navbar() {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Interfaces.User[]>([]);
  const [users, setUsers] = useState<Interfaces.User[]>([]);
  
  const id = localStorage.getItem('_id');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchUsers();
      setUsers(response?.data);
    };
    fetchData();
  }, []);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = users.filter(user => user.username.toLowerCase().includes(query.toLowerCase()));
    setSearchResults(query ? results : []);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="text-2xl font-bold text-indigo-600">
            ShareIt
          </Link>

          <div className="relative flex-1 max-w-xs mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {searchResults.length > 0 && searchQuery && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border">
                {searchResults.map(user => (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setSearchQuery('')}
                  >
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="font-semibold">{user.username}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/home" className="p-2 hover:bg-gray-100 rounded-full">
              <Home className="h-6 w-6" />
            </Link>
            <Link to={`/profile/${id}`} className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6" />
            </Link>
            <Link to={`/chat`} className="p-2 hover:bg-gray-100 rounded-full">
              <MessageCircle className="h-6 w-6" />
            </Link>
            <Link to="/login" onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full">
              <LogOut className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
