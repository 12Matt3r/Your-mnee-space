import React, { useState } from 'react';
import { PencilIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { useSocialFeatures } from '../../../hooks/useSocialFeatures';
import { useAuth } from '../../../hooks/useAuth';
import { formatRelativeTime } from '../../../lib/utils';
import toast from 'react-hot-toast';

interface GuestbookWidgetProps {
  profileId?: string;
}

export const GuestbookWidget: React.FC<GuestbookWidgetProps> = ({ profileId }) => {
  const { user } = useAuth();
  // Fallback to current user if no profileId provided
  const targetId = profileId || user?.id;
  const { guestbookEntries, loading, signGuestbook } = useSocialFeatures(targetId || '');
  const [newMessage, setNewMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    setIsSigning(true);
    try {
      await signGuestbook(newMessage);
      setNewMessage('');
      toast.success('Guestbook signed!');
    } catch (error) {
      console.error('Failed to sign guestbook:', error);
      toast.error('Failed to sign guestbook');
    } finally {
      setIsSigning(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading Guestbook...</div>;

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Guestbook</h3>

      {/* Sign Form */}
      {user ? (
        <form onSubmit={handleSign} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Sign the guestbook..."
            disabled={isSigning}
            className="flex-1 bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSigning || !newMessage.trim()}
            className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
          >
            {isSigning ? <LoadingSpinner size="sm" /> : <PaperAirplaneIcon className="w-5 h-5" />}
          </button>
        </form>
      ) : (
        <div className="mb-6 text-sm text-gray-500 text-center">Sign in to leave a message.</div>
      )}

      {/* Entries */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {guestbookEntries.length === 0 ? (
          <div className="text-center text-gray-500 italic text-sm">Be the first to sign!</div>
        ) : (
          guestbookEntries.map((entry) => (
            <div key={entry.id} className="flex gap-3 text-sm">
              {entry.author?.avatar_url ? (
                <img src={entry.author.avatar_url} alt={entry.author.display_name || 'User'} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                  {(entry.author?.display_name || entry.author?.username || '?')[0]}
                </div>
              )}
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-pink-400">{entry.author?.display_name || entry.author?.username || 'Unknown'}</span>
                  <span className="text-xs text-gray-500">{formatRelativeTime(entry.created_at)}</span>
                </div>
                <p className="text-gray-300">{entry.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
