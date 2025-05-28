
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar: string;
    status: 'alive' | 'dead';
  };
}

export function useFollows() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [following, setFollowing] = useState<Follow[]>([]);
  const [followers, setFollowers] = useState<Follow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollows();
    }
  }, [user]);

  const fetchFollows = async () => {
    if (!user) return;

    try {
      // Get who current user is following
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select(`
          *,
          profiles!follows_following_id_fkey (username, avatar, status)
        `)
        .eq('follower_id', user.id);

      if (followingError) throw followingError;

      // Get current user's followers
      const { data: followersData, error: followersError } = await supabase
        .from('follows')
        .select(`
          *,
          profiles!follows_follower_id_fkey (username, avatar, status)
        `)
        .eq('following_id', user.id);

      if (followersError) throw followersError;

      setFollowing(followingData || []);
      setFollowers(followersData || []);
    } catch (error) {
      console.error('Error fetching follows:', error);
    } finally {
      setLoading(false);
    }
  };

  const followUser = async (userId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('follows')
        .insert([{ follower_id: user.id, following_id: userId }]);

      if (error) throw error;

      toast({
        title: "User followed! 👥",
        description: "You're now following this user",
      });

      await fetchFollows();
      return true;
    } catch (error) {
      console.error('Error following user:', error);
      toast({
        title: "Failed to follow",
        description: "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', userId);

      if (error) throw error;

      toast({
        title: "User unfollowed",
        description: "You're no longer following this user",
      });

      await fetchFollows();
      return true;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast({
        title: "Failed to unfollow",
        description: "Something went wrong",
        variant: "destructive",
      });
      return false;
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(follow => follow.following_id === userId);
  };

  return {
    following,
    followers,
    loading,
    followUser,
    unfollowUser,
    isFollowing,
    fetchFollows,
  };
}
