
import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useHeartTransactions } from '../hooks/useHeartTransactions';
import { usePosts, Comment } from '../hooks/usePosts';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { FollowButton } from './FollowButton';
import { CommentReply } from './CommentReply';
import { Post } from '../hooks/usePosts';

interface PostCardProps {
  post: Post;
  onPostUpdate?: (updatedPost: Post) => void;
}

export const PostCard = ({ post, onPostUpdate }: PostCardProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { likePost, unlikePost, commentPost, loading } = useHeartTransactions();
  const { fetchComments, likeComment, unlikeComment } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Local state for optimistic updates
  const [localPost, setLocalPost] = useState(post);
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  React.useEffect(() => {
    setLocalPost(post);
  }, [post]);

  React.useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleLike = async () => {
    if (!profile || profile.hearts < 1) return;
    
    // Optimistic update
    const wasLiked = localPost.user_has_liked;
    const optimisticPost = {
      ...localPost,
      user_has_liked: !wasLiked,
      likes_count: wasLiked ? localPost.likes_count - 1 : localPost.likes_count + 1
    };
    setLocalPost(optimisticPost);
    onPostUpdate?.(optimisticPost);
    
    let success = false;
    if (wasLiked) {
      success = await unlikePost(localPost.id);
    } else {
      success = await likePost(localPost.id);
    }
    
    // If the request failed, revert the optimistic update
    if (!success) {
      setLocalPost(localPost);
      onPostUpdate?.(localPost);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !profile || profile.hearts < 3) return;
    
    // Optimistic update - add comment immediately
    const optimisticComment: Comment = {
      id: `temp_${Date.now()}`,
      user_id: user!.id,
      post_id: localPost.id,
      content: newComment,
      created_at: new Date().toISOString(),
      likes_count: 0,
      parent_comment_id: null,
      profiles: {
        username: profile.username,
        avatar: profile.avatar,
        status: profile.status
      },
      user_has_liked: false,
      replies: []
    };
    
    const optimisticPost = {
      ...localPost,
      comments_count: localPost.comments_count + 1
    };
    
    setLocalComments([...localComments, optimisticComment]);
    setLocalPost(optimisticPost);
    onPostUpdate?.(optimisticPost);
    setNewComment('');
    
    const success = await commentPost(localPost.id, newComment);
    if (success) {
      if (showComments) {
        await loadComments();
      }
    } else {
      // Revert optimistic updates on failure
      setLocalComments(localComments);
      setLocalPost(localPost);
      onPostUpdate?.(localPost);
      setNewComment(newComment); // Restore the comment text
    }
  };

  const handleCommentLike = async (commentId: string, isLiked: boolean) => {
    if (!profile || profile.hearts < 1) return;
    
    // Optimistic update for comment likes
    const updateCommentLikes = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            user_has_liked: !isLiked,
            likes_count: isLiked ? comment.likes_count - 1 : comment.likes_count + 1
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentLikes(comment.replies)
          };
        }
        return comment;
      });
    };
    
    const optimisticComments = updateCommentLikes(localComments);
    setLocalComments(optimisticComments);
    
    let success = false;
    if (isLiked) {
      success = await unlikeComment(commentId);
    } else {
      success = await likeComment(commentId);
    }
    
    if (success) {
      await loadComments(); // Refresh from server
    } else {
      // Revert on failure
      setLocalComments(localComments);
    }
  };

  const loadComments = async () => {
    setLoadingComments(true);
    const commentsData = await fetchComments(localPost.id);
    setComments(commentsData);
    setLocalComments(commentsData);
    setLoadingComments(false);
  };

  const toggleComments = async () => {
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
  };

  const handleReplySubmitted = async () => {
    setReplyingTo(null);
    await loadComments();
  };

  const canLike = profile && profile.hearts >= 1 && profile.status !== 'dead';
  const canComment = profile && profile.hearts >= 3 && profile.status !== 'dead';
  const isOwnPost = user?.id === localPost.user_id;

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`flex space-x-3 ${isReply ? 'ml-8 mt-2' : ''}`}>
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
          <p className="text-gray-900 text-sm mb-2">{comment.content}</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCommentLike(comment.id, comment.user_has_liked || false)}
              disabled={loading || !canLike}
              className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all ${
                comment.user_has_liked
                  ? 'bg-red-100 text-red-600'
                  : canLike
                  ? 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              <Heart className={`w-3 h-3 ${comment.user_has_liked ? 'fill-current' : ''}`} />
              <span>{comment.likes_count}</span>
            </button>
            {!isReply && canComment && (
              <button
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                Reply
              </button>
            )}
          </div>
        </div>
        
        {/* Reply input */}
        {replyingTo === comment.id && (
          <CommentReply
            postId={localPost.id}
            parentCommentId={comment.id}
            onReplySubmitted={handleReplySubmitted}
            onCancel={() => setReplyingTo(null)}
          />
        )}
        
        {/* Render replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2">
            {comment.replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{localPost.profiles.avatar}</span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">{localPost.profiles.username}</span>
              {localPost.profiles.status === 'dead' && <span className="text-gray-400">💀</span>}
              {!isOwnPost && user && <FollowButton userId={localPost.user_id} username={localPost.profiles.username} />}
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                localPost.profiles.status === 'dead'
                  ? 'bg-gray-100 text-gray-500' 
                  : localPost.profiles.hearts < 10
                    ? 'bg-red-50 text-red-600'
                    : 'bg-pink-50 text-red-600'
              }`}>
                <Heart className={`w-3 h-3 ${
                  localPost.profiles.status === 'dead' ? 'text-gray-400' : 'text-red-500'
                }`} />
                <span className="font-medium">{localPost.profiles.hearts}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(localPost.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap">{localPost.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 border-t pt-3">
        <button
          onClick={handleLike}
          disabled={loading || !canLike}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full transition-all ${
            localPost.user_has_liked
              ? 'bg-red-100 text-red-600'
              : canLike
              ? 'hover:bg-red-50 text-gray-600 hover:text-red-600'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <Heart className={`w-4 h-4 ${localPost.user_has_liked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{localPost.likes_count}</span>
        </button>

        <button
          onClick={toggleComments}
          className="flex items-center space-x-2 px-3 py-1 rounded-full hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{localPost.comments_count}</span>
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
              localComments.map(comment => renderComment(comment))
            )}
            
            {localComments.length === 0 && !loadingComments && (
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
