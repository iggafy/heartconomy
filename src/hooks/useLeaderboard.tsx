
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VampireUser {
  id: string;
  username: string;
  avatar: string;
  hearts: number;
  status: 'alive' | 'dead';
  total_hearts_earned: number;
  total_hearts_spent: number;
  vampire_ratio: number;
}

export function useLeaderboard() {
  const [vampires, setVampires] = useState<VampireUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVampires();
  }, []);

  const fetchVampires = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .gt('total_hearts_earned', 0)
        .order('total_hearts_earned', { ascending: false });

      if (error) throw error;

      // Calculate vampire ratio (hearts received vs hearts spent)
      const vampireData = (data || []).map(user => ({
        ...user,
        vampire_ratio: user.total_hearts_spent > 0 
          ? user.total_hearts_earned / user.total_hearts_spent 
          : user.total_hearts_earned
      })).sort((a, b) => b.vampire_ratio - a.vampire_ratio);

      setVampires(vampireData);
    } catch (error) {
      console.error('Error fetching vampires:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    vampires,
    loading,
    fetchVampires,
  };
}
