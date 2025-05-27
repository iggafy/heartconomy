
import React, { useState } from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { usePosts, Post, Comment } from '../hooks/usePosts';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { profile } = useProfile();
  const { likePost, unlikePost, fetchComments, createComment } = usePosts();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likingPost, setLikingPost] = useState(false);

  const isLiked = post.user_has_liked;
  const canLike = profile && profile.status !== 'dead' && profile.hearts >= 1 && !isLiked;
  const canComment = profile && profile.status !== 'dead' && profile.hearts >= 5;

  const handleLike = async () => {
    if (!profile || !canLike || likingPost) return;
    
    setLikingPost(true);
    if (profile.hearts >= 1) {
      const success = await likePost(post.id);
      if (success) {
        // Update local hearts count optimistically
        profile.hearts -= 1;
      }
    }
    setLikingPost(false);
  };

  const handleUnlike = async () => {
    if (!profile || likingPost) return;
    
    setLikingPost(true);
    await unlikePost(post.id);
    setLikingPost(false);
  };

  const handleToggleComments = async () => {
    if (!showComments) {
      setLoadingComments(true);
      const fetchedComments = await fetchComments(post.id);
      setComments(fetchedComments);
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const handleComment = async () => {
    if (!profile || !canComment || !commentText.trim() || submittingComment) return;
    
    setSubmittingComment(true);
    if (profile.hearts >= 5) {
      const success = await createComment(post.id, commentText);
      if (success) {
        setCommentText('');
        // Refresh comments
        const fetchedComments = await fetchComments(post.id);
        setComments(fetchedComments);
        // Update local hearts count optimistically
        profile.hearts -= 5;
      }
    }
    setSubmittingComment(false);
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-6 transition-all duration-300 ${
      post.profiles.status === 'dead' ? 'opacity-60 grayscale hover:opacity-80' : 'hover:shadow-md'
    }`}>
      {/* Author info */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{post.profiles.avatar}</span>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${
              post.profiles.status === 'dead' ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {post.profiles.username}
            </span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              post.profiles.status === 'dead' 
                ? 'bg-gray-100 text-gray-500' 
                : post.profiles.hearts < 10
                  ? 'bg-red-50 text-red-600'
                  : 'bg-pink-50 text-red-600'
            }`}>
              <Heart className="w-3 h-3" />
              <span>{post.profiles.hearts}</span>
            </div>
            {post.profiles.status === 'dead' && (
              <>
                <span className="text-gray-400">👻</span>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                  DEAD
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="mb-4">
        <p className="text-gray-800 leading-relaxed">{post.content}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
        <button
          onClick={isLiked ? handleUnlike : handleLike}
          disabled={(!canLike && !isLiked) || likingPost}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : canLike && !likingPost
                ? 'bg-pink-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title={
            !profile?.hearts || profile.hearts === 0
              ? "You're out of Hearts"
              : !canLike && !isLiked
                ? "You need 1 Heart to like"
                : "1 Heart"
          }
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${(canLike && !likingPost) ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{post.likes_count}</span>
          <span className="text-xs opacity-70">1♥</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comments_count}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {/* Comment input */}
          {profile && profile.status !== 'dead' && (
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={canComment ? "Share your thoughts... (costs 5 Hearts)" : "You need 5 Hearts to comment"}
                disabled={!canComment || submittingComment}
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                  canComment
                    ? 'border-gray-200 focus:ring-red-200 focus:border-red-300'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
                rows={2}
              />
              <button
                onClick={handleComment}
                disabled={!canComment || !commentText.trim() || submittingComment}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  canComment && commentText.trim() && !submittingComment
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submittingComment ? 'Commenting...' : 'Comment (5♥)'}
              </button>
            </div>
          )}

          {/* Comments list */}
          {loadingComments ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm">{comment.profiles.avatar}</span>
                  <span className={`text-sm font-medium ${
                    comment.profiles.status === 'dead' ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}>
                    {comment.profiles.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
