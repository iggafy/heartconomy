
import React from 'react';
import { useUserStore } from '../store/userStore';
import { usePostStore } from '../store/postStore';
import { Heart, Skull } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const DeadZone = () => {
  const { users, currentUser, reviveUser } = useUserStore();
  const { posts } = usePostStore();

  const deadUsers = users.filter(user => user.isDead);
  
  const deadUserPosts = deadUsers.map(user => {
    const userPosts = posts.filter(post => post.userId === user.id);
    const lastPost = userPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    return { user, lastPost };
  }).filter(item => item.lastPost);

  const canRevive = currentUser && !currentUser.isDead && currentUser.hearts >= 1;

  const handleRevive = (userId: string) => {
    if (!canRevive) return;
    reviveUser(userId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="text-6xl mb-4">👻</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">The Dead Zone</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          These souls have spent their last hearts. View their final posts and decide who deserves a second chance.
        </p>
      </div>

      {deadUserPosts.length === 0 ? (
        <div className="text-center py-12">
          <Skull className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No dead users yet. The heartconomy is merciful today.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {deadUserPosts.map(({ user, lastPost }) => (
            <div
              key={user.id}
              className="bg-gray-900 rounded-lg border border-gray-700 p-6 text-white relative overflow-hidden"
            >
              {/* Ghostly overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/40 pointer-events-none" />
              
              <div className="relative z-10">
                {/* User info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl opacity-60">{user.avatar}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white line-through">
                          {user.username}
                        </span>
                        <span className="text-xs bg-red-900 text-red-200 px-2 py-1 rounded-full">
                          DEAD
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Dead since {formatDistanceToNow(lastPost.createdAt, { addSuffix: true })}
                      </div>
                    </div>
                  </div>

                  {/* Revive button */}
                  <button
                    onClick={() => handleRevive(user.id)}
                    disabled={!canRevive}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                      canRevive
                        ? 'bg-red-600 text-white hover:bg-red-500 hover:scale-105 active:scale-95 animate-pulse'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                    title={canRevive ? "Revive this user (costs 1 Heart)" : "You need Hearts to revive"}
                  >
                    <Heart className="w-4 h-4" />
                    <span>Revive (1♥)</span>
                  </button>
                </div>

                {/* Last post */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Final words:</div>
                  <p className="text-gray-200 italic">"{lastPost.content}"</p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Heart className="w-3 h-3" />
                      <span>{lastPost.likes}</span>
                    </span>
                    <span>{lastPost.comments.length} comments</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-red-400">{user.totalHeartsEarned}</div>
                    <div className="text-xs text-gray-400">Hearts Earned</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-300">{user.totalHeartsSpent}</div>
                    <div className="text-xs text-gray-400">Hearts Spent</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-400">{user.revivesGiven}</div>
                    <div className="text-xs text-gray-400">Revives Given</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">{user.revivesReceived}</div>
                    <div className="text-xs text-gray-400">Times Revived</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warning for current user */}
      {currentUser && !currentUser.isDead && currentUser.hearts < 5 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-700">
            ⚠️ You're dangerously close to joining the Dead Zone yourself. Spend wisely!
          </p>
        </div>
      )}
    </div>
  );
};
