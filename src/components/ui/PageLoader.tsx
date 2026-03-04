import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-mnee-charcoal/50 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
    </div>
  );
};
