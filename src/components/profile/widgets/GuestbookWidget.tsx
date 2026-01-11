import React, { useState } from 'react';
import { PencilIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface GuestbookEntry {
  id: number;
  user: string;
  message: string;
  date: string;
  avatar: string;
}

const MOCK_ENTRIES: GuestbookEntry[] = [
  { id: 1, user: 'RetroFan99', message: 'Love the vibe of your room! So cool.', date: '2 days ago', avatar: 'https://ui-avatars.com/api/?name=R&background=random' },
  { id: 2, user: 'CyberPunk', message: 'Thanks for the tutorial on neon shaders.', date: '5 days ago', avatar: 'https://ui-avatars.com/api/?name=C&background=random' },
];

export const GuestbookWidget = () => {
  const [entries, setEntries] = useState(MOCK_ENTRIES);
  const [newMessage, setNewMessage] = useState('');

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newEntry = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      date: 'Just now',
      avatar: 'https://ui-avatars.com/api/?name=Y&background=random'
    };

    setEntries([newEntry, ...entries]);
    setNewMessage('');
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Guestbook</h3>

      {/* Sign Form */}
      <form onSubmit={handleSign} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Sign the guestbook..."
          className="flex-1 bg-black/30 border border-purple-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          className="p-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>

      {/* Entries */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-3 text-sm">
            <img src={entry.avatar} alt={entry.user} className="w-8 h-8 rounded-full" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-pink-400">{entry.user}</span>
                <span className="text-xs text-gray-500">{entry.date}</span>
              </div>
              <p className="text-gray-300">{entry.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
