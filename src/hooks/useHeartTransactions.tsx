
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';

export function useHeartTransactions() {
  const [loading, setLoading] = useState(false);
  const { fetchProfile } = useProfile();

  const transferHearts = async (recipientId: string, amount: number) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'transfer_hearts', userId: recipientId, amount }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error transferring hearts:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reviveUser = async (userId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'revive_user', userId }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error reviving user:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    transferHearts,
    reviveUser,
    loading
  };
}
