
import React from 'react';
import { Home, Skull, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'feed' | 'deadzone' | 'profile';
  onTabChange: (tab: 'feed' | 'deadzone' | 'profile') => void;
}

export const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const tabs = [
    { id: 'feed' as const, label: 'Feed', icon: Home },
    { id: 'deadzone' as const, label: 'Dead Zone', icon: Skull },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <nav className="bg-white rounded-full shadow-sm border border-gray-200 p-1">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-full transition-all duration-200 ${
                isActive
                  ? tab.id === 'deadzone'
                    ? 'bg-gray-800 text-white'
                    : 'bg-red-500 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
