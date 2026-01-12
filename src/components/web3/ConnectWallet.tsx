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
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-xl p-1.5 border border-purple-500/30 shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-white/10">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 animate-pulse">
            <span className="font-bold text-green-400 text-xs">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Balance</span>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              {balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(2)} MNEE` : 'Loading...'}
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10" />

        <button
          onClick={() => disconnect()}
          aria-label="Disconnect wallet"
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white group relative"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5" />
          <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-black/80 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Disconnect
          </span>
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
