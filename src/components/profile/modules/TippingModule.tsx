import React, { useState } from 'react'
import { GiftIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { formatMneeWithUsd, mneeToUsd } from '../../../lib/mnee'

interface TippingModuleProps {
  creatorName: string
  onTip: (amount: number) => void
}

export const TippingModule: React.FC<TippingModuleProps> = ({ creatorName, onTip }) => {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [amount, setAmount] = useState<number | null>(null)
  const presets = [1, 5, 10, 25]

  const handleTip = async (selectedAmount: number) => {
    if (selectedAmount === 0) {
      onTip(0) // Handle custom amount via parent
      return
    }

    setAmount(selectedAmount)
    setLoading(true)
    setSuccess(false)

    // Simulate Fiat -> MNEE Conversion
    // "I'm not buying MNEE... I'm just gonna pay you and will convert it"
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating network/conversion delay

    setLoading(false)
    setSuccess(true)
    onTip(selectedAmount)

    // Reset after success message
    setTimeout(() => {
      setSuccess(false)
      setAmount(null)
    }, 3000)
  }

  if (loading && amount) {
    return (
      <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto bg-black/40 rounded-full flex items-center justify-center mb-4">
          <ArrowPathIcon className="h-6 w-6 text-pink-400 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Processing Payment...</h3>
        <p className="text-gray-400 text-xs">
          Converting ${amount.toFixed(2)} USD to MNEE Stablecoin
        </p>
        <div className="mt-4 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-pink-500 to-purple-500 animate-progress" />
        </div>
      </div>
    )
  }

  if (success && amount) {
    return (
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Sent!</h3>
        <p className="text-green-300 font-mono text-sm mb-2">
          {formatMneeWithUsd(amount)}
        </p>
        <p className="text-gray-400 text-xs">
          Your payment was automatically converted and sent to {creatorName}'s wallet.
        </p>
      </div>
    )
  }

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
        {presets.map(amt => (
          <button
            key={amt}
            onClick={() => handleTip(amt)}
            className="py-2 bg-black/30 hover:bg-pink-500/20 border border-purple-500/30 hover:border-pink-500/50 rounded-lg text-white font-medium transition-all"
          >
            ${amt}
          </button>
        ))}
      </div>

      <button
        onClick={() => handleTip(0)}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-bold hover:from-pink-600 hover:to-purple-600 transition-all neon-glow"
      >
        Send Tip
      </button>
    </div>
  )
}
