import React from 'react'
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { MNEE_CONTRACT_ADDRESS } from '../../lib/wagmi'
import { formatUnits } from 'viem'
import { Wallet, LogOut } from 'lucide-react'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { data: balance } = useBalance({
    address,
    token: MNEE_CONTRACT_ADDRESS,
  } as any)

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-2 border border-gray-700">
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">Connected</span>
          <span className="text-sm font-bold text-green-400">
            {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)} MNEE` : 'Loading...'}
          </span>
        </div>
        <div className="h-8 w-px bg-gray-700" />
        <button
          onClick={() => disconnect()}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors text-white"
        >
          <Wallet className="w-4 h-4" />
          {connector.name}
        </button>
      ))}
    </div>
  )
}
