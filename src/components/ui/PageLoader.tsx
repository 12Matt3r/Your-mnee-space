import { LoadingSpinner } from './LoadingSpinner'

export const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <LoadingSpinner size="lg" />
    </div>
  )
}
