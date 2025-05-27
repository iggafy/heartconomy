
import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { usePosts } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';

export const Feed = () => {
  const { posts, loading } = usePosts();
  const { profile } = useProfile();
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes_count - a.likes_count;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 border">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sort controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Feed</h2>
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'recent'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'popular'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* Create post */}
      {profile && profile.status !== 'dead' && <CreatePost />}

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {sortedPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Be the first to share something!</p>
          </div>
        )}
      </div>
    </div>
  );
};
