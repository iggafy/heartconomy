
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useHeartTransactions } from '../hooks/useHeartTransactions';
import { Send } from 'lucide-react';

export const CreatePost = () => {
  const { profile } = useProfile();
  const { createPost, loading } = useHeartTransactions();
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !content.trim() || profile.status === 'dead') return;

    const success = await createPost(content);
    if (success) {
      setContent('');
      // Refresh the page to show updated hearts and new post
      window.location.reload();
    }
  };

  if (!profile || profile.status === 'dead') return null;

  const canPost = profile.hearts >= 2;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{profile.avatar}</span>
        <div>
          <span className="font-semibold text-gray-900">{profile.username}</span>
          <div className="text-xs text-gray-500">Share your thoughts with the world</div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={canPost ? "What's on your mind? Make it count..." : "You need 2 Hearts to post"}
          className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
            canPost 
              ? 'border-gray-200 focus:ring-red-200 focus:border-red-300'
              : 'border-gray-200 bg-gray-50 text-gray-400'
          }`}
          rows={3}
          disabled={loading || !canPost}
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {canPost 
              ? "Post wisely — costs 2 Hearts but you earn them back when others engage"
              : "You need 2 Hearts to post"
            }
          </div>
          <button
            type="submit"
            disabled={!content.trim() || loading || !canPost}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all ${
              content.trim() && !loading && canPost
                ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{loading ? 'Posting...' : 'Post (2♥)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
