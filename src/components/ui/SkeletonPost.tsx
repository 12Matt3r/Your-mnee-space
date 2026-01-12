import React from 'react';

const SkeletonPost = () => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 animate-pulse">
      <div className="flex space-x-3">
        {/* Avatar Skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Header Skeleton */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-16" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
          </div>

          {/* Actions Skeleton */}
          <div className="flex justify-between mt-4 max-w-md">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPost;
