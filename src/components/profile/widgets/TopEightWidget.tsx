import React from 'react';
import { UserPlus } from 'lucide-react';
import { useSocialFeatures } from '../../../hooks/useSocialFeatures';
import { useAuth } from '../../../hooks/useAuth';

interface TopEightWidgetProps {
  profileId?: string;
}

export const TopEightWidget: React.FC<TopEightWidgetProps> = ({ profileId }) => {
  const { user } = useAuth();
  // Fallback to current user if no profileId provided (legacy support)
  const targetId = profileId || user?.id;
  const { topEight, loading } = useSocialFeatures(targetId || '');

  if (loading) return <div className="p-6 text-center text-gray-500">Loading Top 8...</div>;

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-pink-500">♥</span> My Top 8
        </h3>
        {user?.id === targetId && <span className="text-xs text-gray-500 cursor-pointer hover:text-white">Edit</span>}
      </div>

      {topEight.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No friends in Top 8 yet.</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {topEight.map((item) => (
            <div key={item.id} className="flex flex-col items-center group cursor-pointer">
              <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-transparent group-hover:border-pink-500 transition-all mb-2 bg-gray-800">
                {item.friend?.avatar_url ? (
                  <img
                    src={item.friend.avatar_url}
                    alt={item.friend.display_name || item.friend.username || 'Friend'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {(item.friend?.display_name || item.friend?.username || '?')[0]}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-300 group-hover:text-white truncate w-full text-center">
                {item.friend?.display_name || item.friend?.username || 'Unknown'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
