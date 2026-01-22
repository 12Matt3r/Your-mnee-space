import React, { useState, memo } from 'react';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, MoreHorizontal, Coins } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { socialApi } from '../../lib/api';
import { MneeTransactionButton } from '../web3/MneeTransactionButton';
import PostContent from './PostContent';
import PollDisplay from './PollDisplay';
import { PostWithInteractions } from '../../types/social';

const PostItem = ({ post }: { post: PostWithInteractions }) => {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [likes, setLikes] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(post.unlocked_by_user || false);
  const { user } = useAuth();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await socialApi.unlikePost(post.id);
        setLikes(likes - 1);
      } else {
        await socialApi.likePost(post.id);
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user || isLoading) return;

    setIsLoading(true);
    try {
      if (isBookmarked) {
        await socialApi.unbookmarkPost(post.id);
      } else {
        await socialApi.bookmarkPost(post.id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Construct a shareable URL (pointing to social feed for now as deep links aren't implemented)
    const shareUrl = window.location.origin + '/social';
    const shareText = `Check out this post by ${displayName} on YourSpace`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${displayName}`,
          text: shareText,
          url: shareUrl,
        });
        toast.success('Shared successfully');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast.error('Failed to share');
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Failed to copy link');
      }
    }
  };

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const profile = post.profiles;
  const displayName = profile?.full_name || profile?.username || 'Anonymous';
  const username = profile?.username || `user${post.user_id.slice(0, 8)}`;
  const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  // Use a fallback treasury address if the user profile doesn't have one
  const recipientAddress = profile?.wallet_address || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

  return (
    <article className="border-b border-gray-200 dark:border-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer">
      <div className="flex space-x-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900 dark:text-white truncate">
              {displayName}
            </h3>
            <span className="text-gray-500 dark:text-gray-400 truncate">@{username}</span>
            <span className="text-gray-500 dark:text-gray-400">·</span>
            <span className="text-gray-500 dark:text-gray-400 flex-shrink-0">{timeAgo(post.created_at)}</span>
            <button
              aria-label="More options"
              className="ml-auto p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Post Content */}
          <div className="mt-2">
            {post.is_locked && !isUnlocked ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 filter blur-xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                            <Coins className="w-6 h-6 text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Premium Content</h3>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            This post contains exclusive content. Unlock it to view and support {displayName}.
                        </p>
                        <MneeTransactionButton
                            recipientAddress={recipientAddress}
                            amount={post.unlock_price?.toString() || "1.0"}
                            label={`Unlock for ${post.unlock_price || 1} MNEE`}
                            onSuccess={() => setIsUnlocked(true)}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <PostContent text={post.content} />
                    {post.poll && <PollDisplay poll={post.poll} />}
                </>
            )}
          </div>

          {/* Post Actions */}
          <div className="flex items-center justify-between mt-4 max-w-md">
            <button
              aria-label={`Reply to ${displayName}`}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-sm">{post.replies_count}</span>
            </button>

            <button
              aria-label="Repost"
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group"
            >
              <div className="p-2 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <Repeat2 className="w-5 h-5" />
              </div>
              <span className="text-sm">0</span>
            </button>

            <button
              onClick={handleLike}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              aria-pressed={isLiked}
              disabled={!user || isLoading}
              className={`flex items-center space-x-2 transition-colors group ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } ${(!user || isLoading) ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <div className="p-2 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm">{likes}</span>
            </button>

            {/* Tipping Button - Only show if not locked or unlocked */}
            {(!post.is_locked || isUnlocked) && (
                <div className="flex items-center">
                    <MneeTransactionButton
                        recipientAddress={recipientAddress}
                        amount="5.0"
                        label="Tip 5"
                        className="!px-3 !py-1 !text-xs !bg-none !bg-gray-800 hover:!bg-gray-700 text-yellow-400 border border-yellow-500/30"
                        icon={<Coins className="w-3 h-3 text-yellow-400 mr-1" />}
                    />
                </div>
            )}

            <div className="flex items-center space-x-1">
              <button
                onClick={handleBookmark}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark post"}
                aria-pressed={isBookmarked}
                disabled={!user || isLoading}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked
                    ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                } ${(!user || isLoading) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share post"
                className="p-2 rounded-full text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(PostItem);
