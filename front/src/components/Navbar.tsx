import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, User, LogOut } from 'lucide-react';
import { mockUsers } from '../data/mockData';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockUsers>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = mockUsers.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(query ? results : []);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            SocialApp
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
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setSearchQuery('')}
                  >
                    <div className="flex items-center">
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full">
              <Home className="h-6 w-6" />
            </Link>
            <Link to="/profile/1" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6" />
            </Link>
            <Link to="/login" className="p-2 hover:bg-gray-100 rounded-full">
              <LogOut className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}