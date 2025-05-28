
import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useHeartTransactions } from '../hooks/useHeartTransactions';
import { Gift, Send } from 'lucide-react';

interface HeartTransferProps {
  targetUserId: string;
  targetUsername: string;
  onClose: () => void;
}

export const HeartTransfer = ({ targetUserId, targetUsername, onClose }: HeartTransferProps) => {
  const { profile } = useProfile();
  const { loading } = useHeartTransactions();
  const [amount, setAmount] = useState(1);

  const handleTransfer = async () => {
    if (!profile || amount <= 0 || amount > profile.hearts) return;

    const success = await fetch('/api/transfer-hearts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, amount })
    });

    if (success) {
      onClose();
    }
  };

  if (!profile) return null;

  const maxTransfer = Math.min(profile.hearts, 50); // Limit transfers to 50 hearts

  return (
    <div className="bg-white rounded-lg border shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <Gift className="w-5 h-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">Gift Hearts</h3>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          Send hearts to <span className="font-medium">{targetUsername}</span>
        </p>
        <p className="text-sm text-gray-500">
          You have {profile.hearts} hearts available
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to send
        </label>
        <input
          type="number"
          min="1"
          max={maxTransfer}
          value={amount}
          onChange={(e) => setAmount(Math.max(1, Math.min(maxTransfer, parseInt(e.target.value) || 1)))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleTransfer}
          disabled={loading || amount <= 0 || amount > profile.hearts}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          <span>Send {amount}♥</span>
        </button>
      </div>
    </div>
  );
};
