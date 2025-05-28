
import React from 'react';
import { Home, Skull, User, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: 'feed' | 'deadzone' | 'profile' | 'leaderboard';
  onTabChange: (tab: 'feed' | 'deadzone' | 'profile' | 'leaderboard') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'feed' as const, label: 'Feed', icon: Home },
    { id: 'deadzone' as const, label: 'Dead Zone', icon: Skull },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: TrendingUp },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-medium transition-colors ${
                index === 0 ? 'rounded-l-lg' : ''
              } ${
                index === tabs.length - 1 ? 'rounded-r-lg' : ''
              } ${
                activeTab === tab.id
                  ? 'bg-red-50 text-red-600 border-b-2 border-red-500'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
