// Immersive Virtual Room with Arcade - "Enter the Void" Theme
import React, { useState, useEffect, useCallback } from 'react'
import { cn } from '../../lib/utils'
import { Arcade } from './Arcade'

interface VirtualRoomProps {
  roomId?: string
  roomData?: any
  onInteraction?: (type: string, data: any) => void
  onOpenEPK?: () => void
  className?: string
  height?: string
  enableControls?: boolean
  readOnly?: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
}

export const VirtualRoom: React.FC<VirtualRoomProps> = ({
  roomId,
  roomData,
  onInteraction,
  onOpenEPK,
  className,
  height = '600px',
  enableControls = true,
  readOnly = false
}) => {
  const [activeZone, setActiveZone] = useState<string | null>(null)
  const [showArcade, setShowArcade] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  // Generate floating void particles
  useEffect(() => {
    const colors = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B']
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)]
    }))
    setParticles(newParticles)
  }, [])

  // Animate particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        y: p.y <= -5 ? 105 : p.y - p.speed,
        x: p.x + Math.sin(Date.now() * 0.001 + p.id) * 0.05
      })))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Track mouse for parallax effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    })
  }, [])

  // Track room visit
  useEffect(() => {
    if (roomId && onInteraction) {
      onInteraction('room_enter', { roomId, timestamp: Date.now() })
      return () => {
        onInteraction('room_exit', { roomId, timestamp: Date.now() })
      }
    }
  }, [roomId, onInteraction])

  const zones = [
    { id: 'arcade', name: 'ARCADE', icon: '🎮', x: 15, y: 30, color: 'from-purple-500 to-pink-500' },
    { id: 'gallery', name: 'GALLERY', icon: '🖼️', x: 50, y: 25, color: 'from-cyan-500 to-blue-500' },
    { id: 'stage', name: 'STAGE', icon: '🎤', x: 85, y: 30, color: 'from-amber-500 to-red-500' },
    { id: 'lounge', name: 'LOUNGE', icon: '🛋️', x: 30, y: 70, color: 'from-green-500 to-teal-500' },
    { id: 'vault', name: 'VAULT', icon: '💎', x: 70, y: 70, color: 'from-violet-500 to-purple-500' },
  ]

  const handleZoneClick = (zoneId: string) => {
    if (zoneId === 'arcade') {
      setShowArcade(true)
    }
    setActiveZone(zoneId)
    onInteraction?.('zone_enter', { zone: zoneId, timestamp: Date.now() })
  }

  if (showArcade) {
    return <Arcade onBack={() => setShowArcade(false)} onInteraction={onInteraction} />
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden rounded-2xl border border-purple-500/30',
        className
      )}
      style={{ height }}
      onMouseMove={handleMouseMove}
    >
      {/* Deep Void Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/50 to-black">
        {/* Animated starfield */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute rounded-full blur-[0.5px] transition-all"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity: p.opacity,
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`
              }}
            />
          ))}
        </div>

        {/* Nebula effects */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at ${30 + (mousePos.x - 50) * 0.1}% ${40 + (mousePos.y - 50) * 0.1}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at ${70 - (mousePos.x - 50) * 0.1}% ${60 - (mousePos.y - 50) * 0.1}%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)
            `
          }}
        />

        {/* Grid floor with perspective */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2">
          <div 
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
                linear-gradient(0deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              transform: 'perspective(400px) rotateX(75deg)',
              transformOrigin: 'center top',
              maskImage: 'linear-gradient(to bottom, transparent, black 20%, black)'
            }}
          />
        </div>
      </div>

      {/* Void Portal Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 rounded-full border-2 border-purple-500/50 animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute inset-2 rounded-full border border-pink-500/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          {/* Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-600 animate-pulse shadow-lg shadow-purple-500/50 flex items-center justify-center">
              <span className="text-2xl">∞</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Zones */}
      {zones.map(zone => (
        <button
          key={zone.id}
          onClick={() => handleZoneClick(zone.id)}
          className={cn(
            'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group z-20',
            activeZone === zone.id ? 'scale-110' : 'hover:scale-105'
          )}
          style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
        >
          {/* Zone platform */}
          <div className={cn(
            'relative w-20 h-20 rounded-xl bg-gradient-to-br backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center',
            zone.color,
            'shadow-lg group-hover:shadow-xl transition-shadow'
          )}>
            <span className="text-3xl mb-1">{zone.icon}</span>
            <span className="text-[10px] font-bold text-white/90 tracking-wider">{zone.name}</span>
            
            {/* Glow effect on hover */}
            <div className={cn(
              'absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-50 transition-opacity blur-xl -z-10',
              zone.color
            )} />
          </div>

          {/* Connection lines */}
          <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent -z-10" 
               style={{ transform: 'translateY(-50%) rotate(45deg)', transformOrigin: 'left center' }} />
        </button>
      ))}

      {/* Room Title */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30">
        <h1 className="text-3xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-pulse">
          {roomData?.name || 'THE VOID'}
        </h1>
        <p className="text-center text-gray-400 text-sm mt-1">
          {roomData?.description || 'Enter the infinite digital space'}
        </p>
      </div>

      {/* EPK Button */}
      {onOpenEPK && (
        <button
          onClick={onOpenEPK}
          className="absolute top-6 right-6 z-30 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/30"
        >
          📋 EPK
        </button>
      )}

      {/* Navigation hints */}
      {enableControls && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <span className="w-6 h-6 bg-purple-500/30 rounded flex items-center justify-center text-xs">🎮</span>
            <span>Click zones to explore</span>
          </div>
          <div className="w-px h-4 bg-gray-600" />
          <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
            <span className="animate-bounce">✨</span>
            <span>5 areas to discover</span>
          </div>
        </div>
      )}

      {/* Visitor count */}
      {roomData?.visit_count && (
        <div className="absolute bottom-6 right-6 z-30 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-300">
          👥 {roomData.visit_count.toLocaleString()} visitors
        </div>
      )}

      {/* Ambient scan lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
             animation: 'scanlines 8s linear infinite'
           }} />

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  )
}
