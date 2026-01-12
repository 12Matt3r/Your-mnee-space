import { useDemo } from '../../hooks/useDemo'
import { SparklesIcon } from '@heroicons/react/24/outline'

export const DemoBanner = () => {
  const { enableDemoMode, isDemoMode } = useDemo()

  if (isDemoMode) return null

  return (
    <div className="bg-gradient-to-r from-mnee-gold/20 to-mnee-blue/20 border border-mnee-gold/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-mnee-gold to-mnee-blue rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-5 w-5 text-mnee-black" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Try YourSpace Demo</h3>
            <p className="text-gray-400 text-sm">
              Experience the platform instantly with demo content
            </p>
          </div>
        </div>
        <button
          onClick={enableDemoMode}
          className="px-6 py-2 bg-gradient-to-r from-mnee-gold to-mnee-goldDark rounded-lg text-mnee-black font-medium hover:shadow-mnee-gold transition-all duration-200"
        >
          Start Demo
        </button>
      </div>
    </div>
  )
}
