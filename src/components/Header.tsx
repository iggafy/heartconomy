
import React from 'react';
import { useUserStore } from '../store/userStore';
import { Heart, Search, User } from 'lucide-react';

export const Header = () => {
  const { currentUser } = useUserStore();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl animate-pulse">💗</div>
            <h1 className="text-xl font-bold text-gray-900">
              Heartconomy
            </h1>
            <span className="text-xs text-gray-500 italic">Die for the like</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts, users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-colors"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              currentUser?.isDead 
                ? 'bg-gray-100 text-gray-500' 
                : currentUser?.hearts && currentUser.hearts < 10
                  ? 'bg-red-50 text-red-600'
                  : 'bg-pink-50 text-red-600'
            }`}>
              <Heart className={`w-4 h-4 ${
                currentUser?.isDead ? 'text-gray-400' : 'text-red-500'
              } ${!currentUser?.isDead ? 'animate-pulse' : ''}`} />
              <span className="font-semibold">
                {currentUser?.hearts || 0}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currentUser?.avatar}</span>
              <span className={`font-medium ${
                currentUser?.isDead ? 'text-gray-400 line-through' : 'text-gray-700'
              }`}>
                {currentUser?.username}
              </span>
              {currentUser?.isDead && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  DEAD
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Warning banner for low hearts */}
        {currentUser && !currentUser.isDead && currentUser.hearts < 10 && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <p className="text-red-700 text-sm">
              ⚠️ Careful — your Hearts are running low! {currentUser.hearts < 5 && 'You need at least 5 Hearts to comment.'}
            </p>
          </div>
        )}

        {/* Death banner */}
        {currentUser?.isDead && (
          <div className="mt-2 bg-gray-100 border border-gray-300 rounded-lg px-4 py-2">
            <p className="text-gray-600 text-sm">
              💀 You're out of Hearts — you can't like or comment anymore. Someone needs to revive you by liking your latest post.
            </p>
          </div>
        )}
      </div>
    </header>
  );
};
