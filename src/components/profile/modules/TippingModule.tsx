import React from 'react'
import { GiftIcon } from '@heroicons/react/24/outline'

interface TippingModuleProps {
  creatorName: string
  onTip: (amount: number) => void
}

export const TippingModule: React.FC<TippingModuleProps> = ({ creatorName, onTip }) => {
  const presets = [1, 5, 10, 25]

  return (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6 text-center">
      <div className="w-12 h-12 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
        <GiftIcon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Support {creatorName}</h3>
      <p className="text-gray-400 text-sm mb-6">
        Love the content? Send a tip to show your appreciation!
      </p>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {presets.map(amount => (
          <button
            key={amount}
            onClick={() => onTip(amount)}
            className="py-2 bg-black/30 hover:bg-pink-500/20 border border-purple-500/30 hover:border-pink-500/50 rounded-lg text-white font-medium transition-all"
          >
            ${amount}
          </button>
        ))}
      </div>

      <button
        onClick={() => onTip(0)} // 0 triggers custom amount modal
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:from-pink-600 hover:to-purple-600 transition-all neon-glow"
      >
        Send Tip
      </button>
    </div>
  )
}
