import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../../contexts/AuthContext';
import { socialApi } from '../../lib/api';
import { MOCK_POSTS } from '../../data/mockContent';
import { PostWithInteractions } from '../../types/social';
import ComposerBox from './ComposerBox';
import PostItem from './PostItem';
import SkeletonPost from '../ui/SkeletonPost';

// Bolt ⚡ Optimization: Generate mock stats once to keep references stable.
// This prevents unnecessary re-renders of memoized PostItem components.
const STABLE_MOCK_POSTS = MOCK_POSTS.map(p => ({
  ...p,
  likes_count: Math.floor(Math.random() * 500),
  replies_count: Math.floor(Math.random() * 50),
  bookmarks_count: Math.floor(Math.random() * 100),
  is_liked: false,
  is_bookmarked: false
})) as unknown as PostWithInteractions[];

const Timeline = () => {
  const [posts, setPosts] = useState<PostWithInteractions[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'chronological' | 'trending'>('chronological');

  // Intersection Observer for Infinite Scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  const loadPosts = useCallback(async (isRefresh = false) => {
    if (!hasMore && !isRefresh) return;

    setLoading(true);
    try {
      const limit = 10;
      // If we implemented pagination in API, we would pass offset/page here.
      // For now, we fetch distinct chunks or just a limited set.
      // Assuming getPostsWithStats supports offset/limit.
      // Since `getPosts` supports limit, we assume we fetch the latest 20.
      // Real pagination would require API update, but let's stick to the limit for now.
      
      const postsData = await socialApi.getPostsWithStats(limit);

      // Merge Mock Posts (simulating mixing real & suggested/mock content)
      // Use stable mock posts to prevent re-renders
      const mockPostsWithInteractions = STABLE_MOCK_POSTS;

      // In a real scenario, we would append based on unique IDs
      const newPosts = [...mockPostsWithInteractions, ...postsData];
      
      // Sort
      if (feedType === 'trending') {
        newPosts.sort((a, b) => b.likes_count - a.likes_count);
      } else {
        newPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      // Deduplicate
      setPosts(prev => {
        const combined = isRefresh ? newPosts : [...prev, ...newPosts];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        return unique;
      });

      // Mock infinite scroll logic: if we got less than requested, no more data
      // But since we mix mock data, we always have "more" effectively.
      // We'll stop after 50 posts for performance in this demo.
      if (posts.length > 50) setHasMore(false);

    } catch (err) {
      console.error('Error loading posts:', err);
      // Fallback
      if (posts.length === 0) {
         setPosts(STABLE_MOCK_POSTS);
      }
    } finally {
      setLoading(false);
    }
  }, [feedType, hasMore, posts.length]);

  // Initial load
  useEffect(() => {
    loadPosts(true);
  }, [user, feedType]); // Reload when user/feedType changes

  // Infinite Scroll Trigger
  useEffect(() => {
    if (inView && !loading) {
      // Small delay to simulate network and prevent spam
      const timer = setTimeout(() => {
          loadPosts(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [inView, loading, loadPosts]);

  // Refresh Listener
  useEffect(() => {
    const handleRefresh = () => loadPosts(true);
    window.addEventListener('refreshTimeline', handleRefresh);
    return () => window.removeEventListener('refreshTimeline', handleRefresh);
  }, [loadPosts]);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="px-4 py-3" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer">Home</h1>
        </div>
        
        {/* Timeline Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setFeedType('chronological')}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              feedType === 'chronological'
                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setFeedType('trending')}
            className={`flex-1 px-4 py-3 text-center font-medium transition-colors ${
              feedType === 'trending'
                ? 'text-gray-900 dark:text-white border-b-2 border-blue-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Trending
          </button>
        </div>
      </div>
      
      {/* Composer */}
      <ComposerBox />
      
      {/* Posts Feed */}
      <div className="min-h-[200px]">
        <AnimatePresence mode='popLayout'>
            {posts.map((post) => (
                <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                >
                    <PostItem post={post} />
                </motion.div>
            ))}
        </AnimatePresence>

        {loading && (
           <div className="space-y-4">
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
           </div>
        )}

        {/* Intersection Observer Target */}
        {hasMore && <div ref={ref} className="h-10" />}

        {!hasMore && posts.length > 0 && (
             <div className="p-8 text-center text-gray-500">
                 You've reached the end of the creative universe (for now).
             </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No posts yet. {user ? 'Be the first to share something!' : 'Sign in to see posts from the creative community.'}
            </p>
            {user && (
              <button 
                onClick={() => document.querySelector('textarea')?.focus()}
                className="px-6 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
              >
                Create First Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
