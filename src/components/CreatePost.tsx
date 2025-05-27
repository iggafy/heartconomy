
import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { usePostStore } from '../store/postStore';
import { Send } from 'lucide-react';

export const CreatePost = () => {
  const { currentUser } = useUserStore();
  const { createPost } = usePostStore();
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !content.trim()) return;

    createPost(currentUser.id, content);
    setContent('');
  };

  if (!currentUser || currentUser.isDead) return null;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{currentUser.avatar}</span>
        <div>
          <span className="font-semibold text-gray-900">{currentUser.username}</span>
          <div className="text-xs text-gray-500">Share your thoughts with the world</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Make it count..."
          className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          rows={3}
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Post wisely — every word matters in the heartconomy
          </div>
          <button
            type="submit"
            disabled={!content.trim()}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all ${
              content.trim()
                ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Post</span>
          </button>
        </div>
      </form>
    </div>
  );
};
