
import React, { useState } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { usePostStore } from '../store/postStore';
import { useUserStore } from '../store/userStore';

export const Feed = () => {
  const { posts } = usePostStore();
  const { currentUser } = useUserStore();
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

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
      {currentUser && !currentUser.isDead && <CreatePost />}

      {/* Posts */}
      <div className="space-y-4">
        {sortedPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
