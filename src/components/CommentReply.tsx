
import React, { useState } from 'react';
import { useHeartTransactions } from '../hooks/useHeartTransactions';
import { useProfile } from '../hooks/useProfile';

interface CommentReplyProps {
  postId: string;
  parentCommentId: string;
  onReplySubmitted: () => void;
  onCancel: () => void;
}

export const CommentReply = ({ postId, parentCommentId, onReplySubmitted, onCancel }: CommentReplyProps) => {
  const { profile } = useProfile();
  const { commentPost, loading } = useHeartTransactions();
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = async () => {
    if (!replyContent.trim() || !profile || profile.hearts < 3) return;
    
    const success = await commentPost(postId, replyContent, parentCommentId);
    if (success) {
      setReplyContent('');
      onReplySubmitted();
    }
  };

  const canComment = profile && profile.hearts >= 3 && profile.status !== 'dead';

  return (
    <div className="mt-2 ml-8">
      <div className="flex space-x-2">
        <span className="text-sm">{profile?.avatar}</span>
        <div className="flex-1">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={canComment ? "Write a reply... (3♥)" : "You need 3 hearts to reply"}
            className="w-full p-2 border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
            rows={2}
            disabled={!canComment}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">
              {canComment ? "Replies cost 3 Hearts" : "You need 3 Hearts to reply"}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={onCancel}
                className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyContent.trim() || loading || !canComment}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  replyContent.trim() && canComment
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Posting...' : 'Reply'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
