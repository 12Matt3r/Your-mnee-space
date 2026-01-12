// Arcade Component - Interactive Game Zone in The Void
import React, { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

interface ArcadeProps {
  onBack: () => void
  onInteraction?: (type: string, data: any) => void
}

interface ArcadeMachine {
  id: string
  name: string
  icon: string
  color: string
  glowColor: string
  description: string
  type: 'quest' | 'game' | 'challenge' | 'tournament'
  rewards?: string
  players?: number
  status: 'available' | 'playing' | 'coming_soon'
}

export const Arcade: React.FC<ArcadeProps> = ({ onBack, onInteraction }) => {
  const [selectedMachine, setSelectedMachine] = useState<ArcadeMachine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  const machines: ArcadeMachine[] = [
    {
      id: 'void-runner',
      name: 'VOID RUNNER',
      icon: '🏃',
      color: 'from-purple-600 to-violet-700',
      glowColor: 'purple',
      description: 'Race through the infinite void. Collect $MNEE tokens and dodge obstacles.',
      type: 'game',
      rewards: '500 $MNEE',
      players: 1247,
      status: 'available'
    },
    {
      id: 'nft-quest',
      name: 'NFT QUEST',
      icon: '🎨',
      color: 'from-pink-600 to-rose-700',
      glowColor: 'pink',
      description: 'Complete artistic challenges to earn exclusive NFT rewards.',
      type: 'quest',
      rewards: 'Rare NFT',
      players: 856,
      status: 'available'
    },
    {
      id: 'beat-arena',
      name: 'BEAT ARENA',
      icon: '🎵',
      color: 'from-cyan-600 to-blue-700',
      glowColor: 'cyan',
      description: 'Rhythm battles with artists. Match the beat to earn points.',
      type: 'game',
      rewards: '1000 $MNEE',
      players: 2341,
      status: 'available'
    },
    {
      id: 'creator-clash',
      name: 'CREATOR CLASH',
      icon: '⚔️',
      color: 'from-amber-500 to-orange-600',
      glowColor: 'orange',
      description: 'Weekly tournament. Compete with other fans for legendary prizes.',
      type: 'tournament',
      rewards: 'Legendary NFT',
      players: 5420,
      status: 'available'
    },
    {
      id: 'fan-trivia',
      name: 'FAN TRIVIA',
      icon: '🧠',
      color: 'from-green-600 to-emerald-700',
      glowColor: 'green',
      description: 'Test your knowledge about your favorite artists.',
      type: 'challenge',
      rewards: '250 $MNEE',
      players: 3102,
      status: 'available'
    },
    {
      id: 'void-slots',
      name: 'VOID SLOTS',
      icon: '🎰',
      color: 'from-red-600 to-rose-700',
      glowColor: 'red',
      description: 'Spin the cosmic reels. Win rare items and tokens.',
      type: 'game',
      rewards: 'Mystery Prize',
      players: 4521,
      status: 'available'
    }
  ]

  // Ambient floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'][Math.floor(Math.random() * 4)]
    }))
    setParticles(newParticles)
  }, [])

  const handlePlayGame = (machine: ArcadeMachine) => {
    setSelectedMachine(machine)
    setIsPlaying(true)
    setScore(0)
    onInteraction?.('arcade_start', { game: machine.id, timestamp: Date.now() })
    
    // Simulate game play with score increases
    const interval = setInterval(() => {
      setScore(prev => prev + Math.floor(Math.random() * 100))
    }, 500)
    
    setTimeout(() => {
      clearInterval(interval)
      setIsPlaying(false)
      onInteraction?.('arcade_complete', { game: machine.id, score, timestamp: Date.now() })
    }, 5000)
  }

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-b from-black via-purple-950/30 to-black rounded-2xl overflow-hidden border border-purple-500/30">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animationDelay: `${p.id * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Neon ceiling lights */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 opacity-70 blur-sm" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-purple-500/20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-purple-900/50 hover:bg-purple-800/50 rounded-lg transition-colors text-white"
        >
          <span>←</span>
          <span>Back to Room</span>
        </button>
        
        <h1 className="text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-pulse">
          🎮 THE ARCADE
        </h1>
        
        <div className="flex items-center gap-3 bg-black/50 rounded-lg px-4 py-2 border border-purple-500/30">
          <span className="text-yellow-400">💰</span>
          <span className="text-white font-bold">2,500 $MNEE</span>
        </div>
      </div>

      {/* Game playing overlay */}
      {isPlaying && selectedMachine && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <div className={cn(
            'w-32 h-32 rounded-2xl bg-gradient-to-br flex items-center justify-center text-6xl mb-8 animate-bounce',
            selectedMachine.color
          )}>
            {selectedMachine.icon}
          </div>
          <h2 className="text-3xl font-black text-white mb-4">{selectedMachine.name}</h2>
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 mb-4">
            {score.toLocaleString()}
          </div>
          <p className="text-gray-400 animate-pulse">Playing...</p>
          <div className="mt-8 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-[grow_5s_linear]" 
                 style={{ animation: 'grow 5s linear forwards' }} />
          </div>
          <style>{`
            @keyframes grow {
              from { width: 0%; }
              to { width: 100%; }
            }
          `}</style>
        </div>
      )}

      {/* Arcade machines grid */}
      <div className="relative z-10 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine, index) => (
          <div
            key={machine.id}
            className={cn(
              'group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer',
              'hover:scale-[1.02] hover:shadow-2xl',
              selectedMachine?.id === machine.id 
                ? 'border-white/50 shadow-2xl' 
                : 'border-purple-500/30 hover:border-purple-400/50'
            )}
            style={{
              boxShadow: `0 0 30px rgba(${machine.glowColor === 'purple' ? '139, 92, 246' : machine.glowColor === 'pink' ? '236, 72, 153' : machine.glowColor === 'cyan' ? '6, 182, 212' : machine.glowColor === 'orange' ? '249, 115, 22' : machine.glowColor === 'green' ? '16, 185, 129' : '239, 68, 68'}, 0.2)`,
              animationDelay: `${index * 0.1}s`
            }}
            onClick={() => setSelectedMachine(machine)}
          >
            {/* Machine screen */}
            <div className={cn('bg-gradient-to-br p-6', machine.color)}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{machine.icon}</span>
                <span className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase',
                  machine.type === 'quest' && 'bg-pink-900/50 text-pink-300',
                  machine.type === 'game' && 'bg-purple-900/50 text-purple-300',
                  machine.type === 'challenge' && 'bg-green-900/50 text-green-300',
                  machine.type === 'tournament' && 'bg-amber-900/50 text-amber-300'
                )}>
                  {machine.type}
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-wider mb-2">{machine.name}</h3>
              <p className="text-white/80 text-sm">{machine.description}</p>
            </div>

            {/* Machine base */}
            <div className="bg-gray-900/90 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">🏆</span>
                  <span className="text-yellow-400 font-bold text-sm">{machine.rewards}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <span>👥</span>
                  <span>{machine.players?.toLocaleString()} playing</span>
                </div>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayGame(machine)
                }}
                className={cn(
                  'w-full py-3 rounded-lg font-bold text-white transition-all',
                  'bg-gradient-to-r hover:scale-[1.02] active:scale-[0.98]',
                  machine.color
                )}
              >
                {machine.status === 'available' ? '▶ PLAY NOW' : 'COMING SOON'}
              </button>
            </div>

            {/* Glow effect */}
            <div className={cn(
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none',
              machine.color
            )} />
          </div>
        ))}
      </div>

      {/* Bottom stats bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-t border-purple-500/20 p-4">
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-400">17,487 players online</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-purple-400">🎮</span>
            <span className="text-gray-400">6 games available</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">💰</span>
            <span className="text-gray-400">24,500 $MNEE won today</span>
          </div>
        </div>
      </div>

      {/* Floor reflection */}
      <div className="absolute bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none" />
    </div>
  )
}
