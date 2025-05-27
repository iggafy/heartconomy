
import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { usePostStore } from '../store/postStore';
import { Heart, Flame, TrendingUp, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Profile = () => {
  const { currentUser, burnAllHearts } = useUserStore();
  const { posts } = usePostStore();
  const [showBurnConfirm, setShowBurnConfirm] = useState(false);

  if (!currentUser) return null;

  const userPosts = posts.filter(post => post.userId === currentUser.id);
  const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0);

  const handleBurnHearts = () => {
    burnAllHearts();
    setShowBurnConfirm(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className={`bg-white rounded-lg border shadow-sm p-6 ${
        currentUser.isDead ? 'opacity-70 grayscale' : ''
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="text-6xl">{currentUser.avatar}</div>
            <div>
              <h2 className={`text-2xl font-bold ${
                currentUser.isDead ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}>
                {currentUser.username}
              </h2>
              <p className="text-gray-600">
                Joined {formatDistanceToNow(currentUser.joinedAt, { addSuffix: true })}
              </p>
              {currentUser.isDead && (
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-gray-400">👻</span>
                  <span className="text-sm bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    SOCIALLY DEAD
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Heart count display */}
          <div className={`text-center p-6 rounded-lg border-2 ${
            currentUser.isDead 
              ? 'border-gray-300 bg-gray-50' 
              : currentUser.hearts < 10
                ? 'border-red-300 bg-red-50'
                : 'border-pink-300 bg-pink-50'
          }`}>
            <div className={`text-4xl font-bold ${
              currentUser.isDead ? 'text-gray-400' : 'text-red-600'
            }`}>
              {currentUser.hearts}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Hearts
            </div>
            {!currentUser.isDead && currentUser.hearts > 0 && (
              <Heart className="w-6 h-6 text-red-500 mx-auto mt-2 animate-pulse" />
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{currentUser.totalHeartsEarned}</div>
            <div className="text-sm text-gray-600">Hearts Earned</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{currentUser.totalHeartsSpent}</div>
            <div className="text-sm text-gray-600">Hearts Spent</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{currentUser.revivesGiven}</div>
            <div className="text-sm text-gray-600">Revives Given</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
        </div>

        {/* Burn Hearts Button */}
        {!currentUser.isDead && currentUser.hearts > 0 && (
          <div className="text-center">
            {!showBurnConfirm ? (
              <button
                onClick={() => setShowBurnConfirm(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                🔥 Burn All My Hearts
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-700 font-medium">
                  Are you sure? Burning all your Hearts means social death. This action cannot be undone.
                </p>
                <div className="space-x-4">
                  <button
                    onClick={handleBurnHearts}
                    className="bg-red-600 text-white px-6 py-2 rounded-full font-bold hover:bg-red-700"
                  >
                    Yes, Burn Them All 🔥
                  </button>
                  <button
                    onClick={() => setShowBurnConfirm(false)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Revival message for dead users */}
        {currentUser.isDead && (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600">
              💀 You are socially dead. Someone needs to like your latest post to revive you.
            </p>
          </div>
        )}
      </div>

      {/* User's Posts */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Posts ({userPosts.length})</h3>
        
        {userPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't posted anything yet.</p>
            <p className="text-sm mt-1">Share your thoughts to start earning Hearts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map(post => (
              <div
                key={post.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <p className="text-gray-800 mb-3">{post.content}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{post.likes}</span>
                    </span>
                    <span>{post.comments.length} comments</span>
                  </div>
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
