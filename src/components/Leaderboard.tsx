
import React from 'react';
import { TopVampires } from './TopVampires';
import { ActivityFeed } from './ActivityFeed';

export const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <TopVampires />
      <ActivityFeed />
    </div>
  );
};
