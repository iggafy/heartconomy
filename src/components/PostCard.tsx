
import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useHeartTransactions } from '../hooks/useHeartTransactions';
import { usePosts, Comment } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { FollowButton } from './FollowButton';
import { Post } from '../hooks/usePosts';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { likePost, unlikePost, commentPost, loading } = useHeartTransactions();
  const { fetchComments, fetchPosts } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const handleLike = async () => {
    if (!profile || profile.hearts < 1) return;
    
    if (post.user_has_liked) {
      const success = await unlikePost(post.id);
      if (success) {
        await fetchPosts();
      }
    } else {
      const success = await likePost(post.id);
      if (success) {
        await fetchPosts();
      }
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !profile || profile.hearts < 3) return;
    
    const success = await commentPost(post.id, newComment);
    if (success) {
      setNewComment('');
      await fetchPosts();
      if (showComments) {
        await loadComments();
      }
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const commentsData = await fetchComments(post.id);
    setComments(commentsData);
    setLoadingComments(false);
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
  };

  const canLike = profile && profile.hearts >= 1 && profile.status !== 'dead';
  const canComment = profile && profile.hearts >= 3 && profile.status !== 'dead';
  const isOwnPost = user?.id === post.user_id;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{post.profiles.avatar}</span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{post.profiles.username}</span>
              {post.profiles.status === 'dead' && <span className="text-gray-400">💀</span>}
              {!isOwnPost && user && <FollowButton userId={post.user_id} username={post.profiles.username} />}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                post.profiles.status === 'dead'
                  ? 'bg-gray-100 text-gray-500' 
                  : post.profiles.hearts < 10
                    ? 'bg-red-50 text-red-600'
                    : 'bg-pink-50 text-red-600'
              }`}>
                <Heart className={`w-3 h-3 ${
                  post.profiles.status === 'dead' ? 'text-gray-400' : 'text-red-500'
                }`} />
                <span className="font-medium">{post.profiles.hearts}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 border-t pt-3">
        <button
          onClick={handleLike}
          disabled={loading || !canLike}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${
            post.user_has_liked
              ? 'bg-red-100 text-red-600'
              : canLike
              ? 'hover:bg-red-50 text-gray-600 hover:text-red-600'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.user_has_liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likes_count}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{post.comments_count}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t pt-4">
          {/* Comment Input */}
          {profile && profile.status !== 'dead' && (
            <div className="mb-4">
              <div className="flex space-x-3">
                <span className="text-xl">{profile.avatar}</span>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={canComment ? "Share your thoughts... (3♥)" : "You need 3 hearts to comment"}
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                    rows={2}
                    disabled={!canComment}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {canComment ? "Comments cost 3 Hearts" : "You need 3 Hearts to comment"}
                    </span>
                    <button
                      onClick={handleComment}
                      disabled={!newComment.trim() || loading || !canComment}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-all ${
                        newComment.trim() && canComment
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-3">
            {loadingComments ? (
              <div className="text-center py-4">
                <div className="animate-pulse text-gray-500">Loading comments...</div>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <span className="text-lg">{comment.profiles.avatar}</span>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {comment.profiles.username}
                        </span>
                        {comment.profiles.status === 'dead' && <span className="text-gray-400 text-xs">💀</span>}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-900 text-sm">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {comments.length === 0 && !loadingComments && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No comments yet. Be the first to share your thoughts!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
