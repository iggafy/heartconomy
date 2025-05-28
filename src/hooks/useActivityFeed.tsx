
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  details: any;
  created_at: string;
  profiles: {
    username: string;
    avatar: string;
    status: 'alive' | 'dead';
  };
}

export function useActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_feed')
        .select(`
          *,
          profiles (username, avatar, status)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity_type: string, details?: any) => {
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { 
          action: 'add_activity',
          activity_type,
          details 
        }
      });

      if (error) throw error;
      await fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return {
    activities,
    loading,
    fetchActivities,
    addActivity,
  };
}
