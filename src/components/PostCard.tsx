
import React, { useState } from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { usePostStore } from '../store/postStore';
import { Post } from '../store/postStore';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { currentUser, getUserById, spendHearts, earnHearts } = useUserStore();
  const { likePost, addComment } = usePostStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const author = getUserById(post.userId);
  const isLiked = currentUser && post.likedBy.includes(currentUser.id);
  const canLike = currentUser && !currentUser.isDead && currentUser.hearts >= 1 && !isLiked;
  const canComment = currentUser && !currentUser.isDead && currentUser.hearts >= 5;

  const handleLike = () => {
    if (!currentUser || !canLike) return;
    
    if (spendHearts(1)) {
      likePost(post.id, currentUser.id);
      // Give heart to post author if they're not dead
      if (author && !author.isDead && author.id !== currentUser.id) {
        // In a real app, this would update the author's hearts
        console.log(`Giving 1 heart to ${author.username}`);
      }
    }
  };

  const handleComment = () => {
    if (!currentUser || !canComment || !commentText.trim()) return;
    
    if (spendHearts(5)) {
      addComment(post.id, currentUser.id, commentText);
      setCommentText('');
    }
  };

  return (
    <div className={`bg-white rounded-lg border shadow-sm p-6 transition-all duration-300 ${
      author?.isDead ? 'opacity-60 grayscale hover:opacity-80' : 'hover:shadow-md'
    }`}>
      {/* Author info */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">{author?.avatar}</span>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${
              author?.isDead ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {author?.username}
            </span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              author?.isDead 
                ? 'bg-gray-100 text-gray-500' 
                : author?.hearts && author.hearts < 10
                  ? 'bg-red-50 text-red-600'
                  : 'bg-pink-50 text-red-600'
            }`}>
              <Heart className="w-3 h-3" />
              <span>{author?.hearts || 0}</span>
            </div>
            {author?.isDead && (
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
            <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
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
          onClick={handleLike}
          disabled={!canLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : canLike
                ? 'bg-pink-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          title={
            !currentUser?.isDead && currentUser?.hearts === 0
              ? "You're out of Hearts"
              : !canLike && !isLiked
                ? "You need 1 Heart to like"
                : "1 Heart"
          }
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${canLike ? 'animate-pulse' : ''}`} />
          <span className="font-medium">{post.likes}</span>
          <span className="text-xs opacity-70">1♥</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comments.length}</span>
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          {/* Comment input */}
          {currentUser && !currentUser.isDead && (
            <div className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={canComment ? "Share your thoughts... (costs 5 Hearts)" : "You need 5 Hearts to comment"}
                disabled={!canComment}
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                  canComment
                    ? 'border-gray-200 focus:ring-red-200 focus:border-red-300'
                    : 'border-gray-200 bg-gray-50 text-gray-400'
                }`}
                rows={2}
              />
              <button
                onClick={handleComment}
                disabled={!canComment || !commentText.trim()}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  canComment && commentText.trim()
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Comment (5♥)
              </button>
            </div>
          )}

          {/* Comments list */}
          {post.comments.map(comment => {
            const commentAuthor = getUserById(comment.userId);
            return (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm">{commentAuthor?.avatar}</span>
                  <span className={`text-sm font-medium ${
                    commentAuthor?.isDead ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}>
                    {commentAuthor?.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-800">{comment.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
