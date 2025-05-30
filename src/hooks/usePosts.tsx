
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Post {
  id: string;
  user_id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar: string;
    hearts: number;
    status: 'alive' | 'dead';
  };
  user_has_liked?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_comment_id: string | null;
  profiles: {
    username: string;
    avatar: string;
    status: 'alive' | 'dead';
  };
  user_has_liked?: boolean;
  replies?: Comment[];
}

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    setupRealtimeSubscriptions();
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    // Subscribe to posts changes
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          console.log('Posts updated, refreshing...');
          fetchPosts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'likes'
        },
        () => {
          console.log('Likes updated, refreshing...');
          fetchPosts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        () => {
          console.log('Comments updated, refreshing...');
          fetchPosts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Profiles updated, refreshing...');
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar, hearts, status)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts the current user has liked
      if (user && data) {
        const { data: likes } = await supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', user.id);

        const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
        
        const postsWithLikes = data.map(post => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id)
        }));

        setPosts(postsWithLikes);
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingPosts = async () => {
    if (!user) return [];

    try {
      // First get the list of users this user follows
      const { data: followData, error: followError } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (followError) throw followError;

      const followingIds = followData?.map(f => f.following_id) || [];
      
      if (followingIds.length === 0) {
        return [];
      }

      // Then get posts from those users
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles!inner (username, avatar, hearts, status)
        `)
        .in('user_id', followingIds)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check which posts the current user has liked
      const { data: likes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id);

      const likedPostIds = new Set(likes?.map(like => like.post_id) || []);
      
      const postsWithLikes = (data || []).map(post => ({
        ...post,
        user_has_liked: likedPostIds.has(post.id)
      }));

      return postsWithLikes;
    } catch (error) {
      console.error('Error fetching following posts:', error);
      return [];
    }
  };

  const fetchComments = async (postId: string): Promise<Comment[]> => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (username, avatar, status)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Check which comments the current user has liked
      let likedCommentIds = new Set();
      if (user) {
        const { data: commentLikes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id);
        
        likedCommentIds = new Set(commentLikes?.map(like => like.comment_id) || []);
      }

      // Organize comments into threads
      const commentsWithLikes = (data || []).map(comment => ({
        ...comment,
        user_has_liked: likedCommentIds.has(comment.id),
        replies: []
      }));

      // Build threaded structure
      const topLevelComments: Comment[] = [];
      const commentMap = new Map<string, Comment>();

      // First pass: create map
      commentsWithLikes.forEach(comment => {
        commentMap.set(comment.id, comment);
      });

      // Second pass: build tree
      commentsWithLikes.forEach(comment => {
        if (comment.parent_comment_id) {
          const parent = commentMap.get(comment.parent_comment_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          topLevelComments.push(comment);
        }
      });

      return topLevelComments;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const likeComment = async (commentId: string) => {
    if (!user) return false;

    try {
      // First add the comment like record
      const { error: likeError } = await supabase
        .from('comment_likes')
        .insert([{ user_id: user.id, comment_id: commentId }]);

      if (likeError) throw likeError;

      // Then call the edge function for heart transfer
      const { error: heartError } = await supabase.functions.invoke('heart-transactions', {
        body: { action: 'like_comment', commentId }
      });

      if (heartError) {
        console.error('Heart transfer error:', heartError);
      }
      
      return true;
    } catch (error) {
      console.error('Error liking comment:', error);
      return false;
    }
  };

  const unlikeComment = async (commentId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('user_id', user.id)
        .eq('comment_id', commentId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error unliking comment:', error);
      return false;
    }
  };

  return {
    posts,
    loading,
    fetchPosts,
    fetchFollowingPosts,
    fetchComments,
    likeComment,
    unlikeComment,
  };
}
