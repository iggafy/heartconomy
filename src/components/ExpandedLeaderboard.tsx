
import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Crown, Heart, TrendingUp, Users, Gift, RotateCcw } from 'lucide-react';

export const ExpandedLeaderboard = () => {
  const { vampires, loading } = useLeaderboard();
  const [activeCategory, setActiveCategory] = useState<'hearts' | 'vampire' | 'generous' | 'reviver'>('hearts');

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getCategoryData = () => {
    switch (activeCategory) {
      case 'hearts':
        return {
          title: 'Heart Kings 👑',
          description: 'Users with the most hearts currently',
          icon: <Crown className="w-5 h-5 text-yellow-600" />,
          data: [...vampires]
            .filter(user => user.status === 'alive')
            .sort((a, b) => b.hearts - a.hearts)
            .slice(0, 10),
          getValue: (user: any) => user.hearts,
          getSubtext: (user: any) => `${user.total_hearts_earned} earned total`,
          color: 'text-yellow-600'
        };
      case 'vampire':
        return {
          title: 'Top Vampires 🧛',
          description: 'Users who receive more hearts than they give',
          icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
          data: [...vampires]
            .filter(user => user.total_hearts_earned > 0)
            .sort((a, b) => b.vampire_ratio - a.vampire_ratio)
            .slice(0, 10),
          getValue: (user: any) => `${user.vampire_ratio.toFixed(1)}x`,
          getSubtext: (user: any) => `${user.total_hearts_earned}↑ / ${user.total_hearts_spent}↓`,
          color: 'text-purple-600'
        };
      case 'generous':
        return {
          title: 'Most Generous 💝',
          description: 'Users who have spent the most hearts',
          icon: <Gift className="w-5 h-5 text-green-600" />,
          data: [...vampires]
            .filter(user => user.total_hearts_spent > 0)
            .sort((a, b) => b.total_hearts_spent - a.total_hearts_spent)
            .slice(0, 10),
          getValue: (user: any) => user.total_hearts_spent,
          getSubtext: (user: any) => `${user.total_hearts_earned} earned back`,
          color: 'text-green-600'
        };
      case 'reviver':
        return {
          title: 'Life Savers 🚑',
          description: 'Users who have revived the most people',
          icon: <RotateCcw className="w-5 h-5 text-blue-600" />,
          data: [...vampires]
            .filter(user => user.revives_given > 0)
            .sort((a, b) => b.revives_given - a.revives_given)
            .slice(0, 10),
          getValue: (user: any) => user.revives_given,
          getSubtext: (user: any) => `${user.revives_received} times revived`,
          color: 'text-blue-600'
        };
      default:
        return null;
    }
  };

  const categoryData = getCategoryData();
  if (!categoryData) return null;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Users className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">Leaderboards</h2>
      </div>

      {/* Category tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveCategory('hearts')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'hearts'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hearts
        </button>
        <button
          onClick={() => setActiveCategory('vampire')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'vampire'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Vampires
        </button>
        <button
          onClick={() => setActiveCategory('generous')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'generous'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Generous
        </button>
        <button
          onClick={() => setActiveCategory('reviver')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeCategory === 'reviver'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Revivers
        </button>
      </div>

      {/* Category header */}
      <div className="flex items-center space-x-2 mb-4">
        {categoryData.icon}
        <h3 className="text-lg font-bold text-gray-900">{categoryData.title}</h3>
      </div>
      
      <div className="text-sm text-gray-600 mb-4">
        {categoryData.description}
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {categoryData.data.map((user, index) => (
          <div 
            key={user.id}
            className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                index === 1 ? 'bg-gray-100 text-gray-600' :
                index === 2 ? 'bg-orange-100 text-orange-600' :
                'bg-gray-50 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="text-2xl">{user.avatar}</span>
              <div>
                <div className="font-medium text-gray-900">
                  {user.username}
                  {user.status === 'dead' && <span className="text-gray-400 ml-1">💀</span>}
                </div>
                <div className="text-xs text-gray-500">
                  {categoryData.getSubtext(user)}
                </div>
              </div>
            </div>
            
            <div className={`font-bold ${categoryData.color}`}>
              {categoryData.getValue(user)}
            </div>
          </div>
        ))}
        
        {categoryData.data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No data available for this category yet.
          </div>
        )}
      </div>
    </div>
  );
};
