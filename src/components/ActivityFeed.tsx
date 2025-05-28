
import React from 'react';
import { useActivityFeed } from '../hooks/useActivityFeed';
import { Activity, Heart, MessageCircle, Skull, Flame, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const ActivityFeed = () => {
  const { activities, loading } = useActivityFeed();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'died': return <Skull className="w-4 h-4 text-gray-600" />;
      case 'revived': return <Heart className="w-4 h-4 text-green-600" />;
      case 'burned_hearts': return <Flame className="w-4 h-4 text-red-600" />;
      case 'posted': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'received_like': return <Heart className="w-4 h-4 text-red-500" />;
      case 'received_comment': return <MessageCircle className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    const username = activity.profiles?.username || 'Someone';
    const avatar = activity.profiles?.avatar || '😊';
    
    switch (activity.activity_type) {
      case 'died':
        return `${avatar} ${username} ran out of hearts and died`;
      case 'revived':
        return `${avatar} ${username} was revived by someone`;
      case 'burned_hearts':
        return `${avatar} ${username} burned all their hearts`;
      case 'posted':
        return `${avatar} ${username} shared a new post`;
      case 'received_like':
        return `${avatar} ${username} received a like`;
      case 'received_comment':
        return `${avatar} ${username} received a comment`;
      default:
        return `${avatar} ${username} did something`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Activity className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Activity Feed</h2>
      </div>

      <div className="space-y-3">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50">
            {getActivityIcon(activity.activity_type)}
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                {getActivityText(activity)}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No recent activity. Start engaging with the community!
          </div>
        )}
      </div>
    </div>
  );
};
