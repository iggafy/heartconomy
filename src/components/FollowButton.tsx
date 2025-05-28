
import React from 'react';
import { useFollows } from '../hooks/useFollows';
import { UserPlus, UserMinus } from 'lucide-react';

interface FollowButtonProps {
  userId: string;
  username: string;
}

export const FollowButton = ({ userId, username }: FollowButtonProps) => {
  const { isFollowing, followUser, unfollowUser, loading } = useFollows();
  const following = isFollowing(userId);

  const handleClick = async () => {
    if (following) {
      await unfollowUser(userId);
    } else {
      await followUser(userId);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        following
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      } disabled:opacity-50`}
    >
      {following ? (
        <>
          <UserMinus className="w-3 h-3" />
          <span>Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3 h-3" />
          <span>Follow</span>
        </>
      )}
    </button>
  );
};
