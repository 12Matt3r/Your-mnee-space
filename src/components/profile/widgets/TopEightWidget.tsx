import React from 'react';
import { UserPlus } from 'lucide-react';

// Mock Top 8 Data
const TOP_8 = [
  { id: 1, name: 'Alice', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { id: 2, name: 'Bob', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
  { id: 3, name: 'Charlie', image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop' },
  { id: 4, name: 'Diana', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop' },
  { id: 5, name: 'Eve', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { id: 6, name: 'Frank', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { id: 7, name: 'Grace', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop' },
  { id: 8, name: 'Heidi', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop' },
];

export const TopEightWidget = () => {
  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-pink-500">♥</span> My Top 8
        </h3>
        <span className="text-xs text-gray-500">Edit</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {TOP_8.map((friend) => (
          <div key={friend.id} className="flex flex-col items-center group cursor-pointer">
            <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-transparent group-hover:border-pink-500 transition-all mb-2">
              <img
                src={friend.image}
                alt={friend.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs text-gray-300 group-hover:text-white truncate w-full text-center">
              {friend.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
