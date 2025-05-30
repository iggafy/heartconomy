
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

  const createPost = async (content: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'create_post', content }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'like_post', postId }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlikePost = async (postId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const commentPost = async (postId: string, content: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'comment_post', postId, content }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error commenting on post:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const burnHearts = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'burn_hearts' }
      });

      if (error) throw error;
      
      await fetchProfile(); // Refresh profile
      return true;
    } catch (error) {
      console.error('Error burning hearts:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    transferHearts,
    reviveUser,
    createPost,
    likePost,
    unlikePost,
    commentPost,
    burnHearts,
    loading
  };
}
