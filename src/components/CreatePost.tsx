
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { usePosts } from '../hooks/usePosts';
import { Send } from 'lucide-react';

export const CreatePost = () => {
  const { profile } = useProfile();
  const { createPost } = usePosts();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !content.trim() || profile.status === 'dead') return;

    setIsSubmitting(true);
    const success = await createPost(content);
    if (success) {
      setContent('');
    }
    setIsSubmitting(false);
  };

  if (!profile || profile.status === 'dead') return null;

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
          placeholder="What's on your mind? Make it count..."
          className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
          rows={3}
          disabled={isSubmitting}
        />
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Post wisely — every word matters in the heartconomy
          </div>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all ${
              content.trim() && !isSubmitting
                ? 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
