
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export function useHeartTransactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const performTransaction = async (action: string, data: any = {}) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to perform this action",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('heart-transactions', {
        body: { action, ...data }
      });

      if (error) throw error;

      if (result?.error) {
        throw new Error(result.error);
      }

      // Show success message based on action
      switch (action) {
        case 'like_post':
          toast({
            title: "Post liked! ❤️",
            description: "You spent 1 heart to show your appreciation",
          });
          break;
        case 'unlike_post':
          toast({
            title: "Like removed",
            description: "Your heart has been returned",
          });
          break;
        case 'comment_post':
          toast({
            title: "Comment posted! 💬",
            description: "You spent 5 hearts to share your thoughts",
          });
          break;
        case 'revive_user':
          toast({
            title: "User revived! 🔥",
            description: "You spent 1 heart to bring someone back to life",
          });
          break;
        case 'burn_hearts':
          toast({
            title: "Hearts burned! 🔥",
            description: "You have entered the social afterlife",
            variant: "destructive",
          });
          break;
      }

      return true;
    } catch (error) {
      console.error('Transaction error:', error);
      toast({
        title: "Transaction failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    return await performTransaction('like_post', { postId });
  };

  const unlikePost = async (postId: string) => {
    return await performTransaction('unlike_post', { postId });
  };

  const commentPost = async (postId: string, content: string) => {
    return await performTransaction('comment_post', { postId, content });
  };

  const reviveUser = async (targetUserId: string) => {
    return await performTransaction('revive_user', { targetUserId });
  };

  const burnHearts = async () => {
    return await performTransaction('burn_hearts');
  };

  return {
    likePost,
    unlikePost,
    commentPost,
    reviveUser,
    burnHearts,
    loading,
  };
}
