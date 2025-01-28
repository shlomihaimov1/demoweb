import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { User, Message } from '../types';
import { mockMessages } from '../data/mockData';

interface ChatProps {
  user: User;
  onClose: () => void;
}

export default function Chat({ user, onClose }: ChatProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // In a real app, this would be handled by the backend
    const newMessage: Message = {
      id: String(Date.now()),
      senderId: '1',
      receiverId: user._id,
      content: message,
      createdAt: new Date().toISOString()
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold">{user.username}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <div className="h-96 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderId === '1' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderId === '1'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
