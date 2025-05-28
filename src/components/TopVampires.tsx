
import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Crown, TrendingUp } from 'lucide-react';

export const TopVampires = () => {
  const { vampires, loading } = useLeaderboard();

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topVampires = vampires.slice(0, 10);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Crown className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Top Vampires 🧛</h2>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        Users who've received the most hearts while giving the least
      </div>

      <div className="space-y-3">
        {topVampires.map((vampire, index) => (
          <div 
            key={vampire.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                {index + 1}
              </div>
              <span className="text-2xl">{vampire.avatar}</span>
              <div>
                <div className="font-medium text-gray-900">
                  {vampire.username}
                  {vampire.status === 'dead' && <span className="text-gray-400 ml-1">💀</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {vampire.hearts} hearts
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-purple-600 font-medium">
                <TrendingUp className="w-4 h-4 mr-1" />
                {vampire.vampire_ratio.toFixed(1)}x
              </div>
              <div className="text-xs text-gray-500">
                {vampire.total_hearts_earned}↑ / {vampire.total_hearts_spent}↓
              </div>
            </div>
          </div>
        ))}
        
        {topVampires.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No vampires yet. Start earning hearts!
          </div>
        )}
      </div>
    </div>
  );
};
