
import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { usePosts } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';

export const Feed = () => {
  const { posts, loading, fetchFollowingPosts } = usePosts();
  const { profile } = useProfile();
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'following'>('recent');
  const [followingPosts, setFollowingPosts] = useState<any[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  useEffect(() => {
    if (sortBy === 'following') {
      loadFollowingPosts();
    }
  }, [sortBy]);

  const loadFollowingPosts = async () => {
    setLoadingFollowing(true);
    try {
      const following = await fetchFollowingPosts();
      setFollowingPosts(following);
    } catch (error) {
      console.error('Error loading following posts:', error);
    } finally {
      setLoadingFollowing(false);
    }
  };

  const getDisplayPosts = () => {
    if (sortBy === 'following') {
      return followingPosts;
    }

    const postsToSort = [...posts];
    if (sortBy === 'popular') {
      return postsToSort.sort((a, b) => b.likes_count - a.likes_count);
    }
    return postsToSort.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const isLoading = sortBy === 'following' ? loadingFollowing : loading;
  const displayPosts = getDisplayPosts();

  if (isLoading) {
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
          <button
            onClick={() => setSortBy('following')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'following'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Following
          </button>
        </div>
      </div>

      {/* Create post */}
      {profile && profile.status !== 'dead' && <CreatePost />}

      {/* Posts */}
      <div className="space-y-4">
        {displayPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {displayPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {sortBy === 'following' 
                ? "No posts from people you follow yet. Try following some users!"
                : "No posts yet. Be the first to share something!"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
