import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <LoadingSpinner size="lg" className="text-purple-500" />
    </div>
  );
};
