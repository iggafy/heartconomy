
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
  profiles: {
    username: string;
    avatar: string;
    status: 'alive' | 'dead';
  };
}

export function usePosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [user]);

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

  const createPost = async (content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ user_id: user.id, content }]);

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('likes')
        .insert([{ user_id: user.id, post_id: postId }]);

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error liking post:', error);
      return false;
    }
  };

  const unlikePost = async (postId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('post_id', postId);

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts
      return true;
    } catch (error) {
      console.error('Error unliking post:', error);
      return false;
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
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  const createComment = async (postId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ user_id: user.id, post_id: postId, content }]);

      if (error) throw error;
      
      await fetchPosts(); // Refresh posts to update comment count
      return true;
    } catch (error) {
      console.error('Error creating comment:', error);
      return false;
    }
  };

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    likePost,
    unlikePost,
    fetchComments,
    createComment,
  };
}
