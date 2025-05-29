
import React from 'react';
import { ExpandedLeaderboard } from './ExpandedLeaderboard';
import { ActivityFeed } from './ActivityFeed';

export const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <ExpandedLeaderboard />
      <ActivityFeed />
    </div>
  );
};
