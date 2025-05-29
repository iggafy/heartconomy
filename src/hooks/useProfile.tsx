
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  username: string;
  avatar: string;
  hearts: number;
  status: 'alive' | 'dead';
  total_hearts_earned: number;
  total_hearts_spent: number;
  revives_given: number;
  revives_received: number;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      setupRealtimeSubscription();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateHearts = async (newHearts: number) => {
    if (!user || !profile) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ hearts: newHearts })
        .eq('id', user.id);

      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, hearts: newHearts } : null);
      return true;
    } catch (error) {
      console.error('Error updating hearts:', error);
      return false;
    }
  };

  const spendHearts = async (amount: number) => {
    if (!profile || profile.hearts < amount) return false;
    return await updateHearts(profile.hearts - amount);
  };

  const earnHearts = async (amount: number) => {
    if (!profile) return false;
    return await updateHearts(profile.hearts + amount);
  };

  return {
    profile,
    loading,
    fetchProfile,
    spendHearts,
    earnHearts,
    updateHearts,
  };
}
