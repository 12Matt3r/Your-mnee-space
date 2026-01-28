import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black/20 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
};
