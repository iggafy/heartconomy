
import React, { useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Heart, TrendingUp, Users, MessageCircle, Crown, Zap } from 'lucide-react';

export const ExpandedLeaderboard = () => {
  const { vampires, loading } = useLeaderboard();
  const [activeTab, setActiveTab] = useState<'vampires' | 'generous' | 'revivers' | 'active' | 'survivors'>('vampires');

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="animate-pulse text-center">Loading leaderboard...</div>
      </div>
    );
  }

  const getTopGenerousBySpent = () => {
    return [...vampires]
      .filter(user => user.total_hearts_spent > 0)
      .sort((a, b) => b.total_hearts_spent - a.total_hearts_spent)
      .slice(0, 10);
  };

  const getTopRevivers = () => {
    return [...vampires]
      .filter(user => user.revives_given > 0)
      .sort((a, b) => b.revives_given - a.revives_given)
      .slice(0, 10);
  };

  const getTopSurvivors = () => {
    return [...vampires]
      .filter(user => user.status === 'alive')
      .sort((a, b) => b.hearts - a.hearts)
      .slice(0, 10);
  };

  const getTopVampires = () => {
    return [...vampires]
      .sort((a, b) => b.vampire_ratio - a.vampire_ratio)
      .slice(0, 10);
  };

  const tabs = [
    { id: 'vampires', label: 'Top Vampires', icon: Crown, color: 'text-purple-600' },
    { id: 'generous', label: 'Most Generous', icon: Heart, color: 'text-red-600' },
    { id: 'revivers', label: 'Revival Heroes', icon: Zap, color: 'text-green-600' },
    { id: 'survivors', label: 'Top Survivors', icon: TrendingUp, color: 'text-blue-600' },
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'vampires': return getTopVampires();
      case 'generous': return getTopGenerousBySpent();
      case 'revivers': return getTopRevivers();
      case 'survivors': return getTopSurvivors();
      default: return [];
    }
  };

  const getMetricValue = (user: any) => {
    switch (activeTab) {
      case 'vampires': return `${user.vampire_ratio.toFixed(1)}x ratio`;
      case 'generous': return `${user.total_hearts_spent} hearts spent`;
      case 'revivers': return `${user.revives_given} revives`;
      case 'survivors': return `${user.hearts} hearts`;
      default: return '';
    }
  };

  const getMetricLabel = () => {
    switch (activeTab) {
      case 'vampires': return 'Hearts Earned/Spent Ratio';
      case 'generous': return 'Hearts Spent';
      case 'revivers': return 'Revives Given';
      case 'survivors': return 'Current Hearts';
      default: return '';
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <span className="text-sm text-gray-500">{getMetricLabel()}</span>
        </div>

        <div className="space-y-3">
          {getCurrentData().map((user, index) => (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200'
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200'
                  : 'bg-gray-50 border border-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                  index === 0
                    ? 'bg-yellow-500 text-white'
                    : index === 1
                    ? 'bg-gray-500 text-white'
                    : index === 2
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="text-xl">{user.avatar}</span>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${
                      user.status === 'dead' ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      {user.username}
                    </span>
                    {user.status === 'dead' && (
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                        DEAD
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMetricValue(user)}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {user.total_hearts_earned} earned
                </div>
              </div>
            </div>
          ))}
          
          {getCurrentData().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No data available for this category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
