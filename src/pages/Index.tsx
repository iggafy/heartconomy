
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Feed } from '../components/Feed';
import { DeadZone } from '../components/DeadZone';
import { Profile } from '../components/Profile';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'deadzone' | 'profile'>('feed');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loading Heartconomy...</h1>
          <div className="animate-pulse text-red-500 text-6xl">❤️</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'feed' && <Feed />}
          {activeTab === 'deadzone' && <DeadZone />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
};

export default Index;
