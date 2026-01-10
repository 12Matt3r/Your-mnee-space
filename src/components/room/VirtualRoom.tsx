// Temporary Simple VirtualRoom Component
// Fallback without Three.js dependencies for initial testing

import React from 'react'
import { cn } from '../../lib/utils'
import { useTheme, NEON_COLORS } from '../../lib/theme'

interface VirtualRoomProps {
  roomId?: string
  roomData?: any
  onInteraction?: (type: string, data: any) => void
  className?: string
  height?: string
  enableControls?: boolean
  readOnly?: boolean
}

export const VirtualRoom: React.FC<VirtualRoomProps> = ({
  roomId,
  roomData,
  onInteraction,
  className,
  height = '600px',
  enableControls = true,
  readOnly = false
}) => {
  const { currentTheme } = useTheme()
  const accentColor = NEON_COLORS.primary[currentTheme]

  React.useEffect(() => {
    // Track room visit if roomId is provided
    if (roomId && onInteraction) {
      onInteraction('room_enter', { roomId, timestamp: Date.now() })
      
      return () => {
        onInteraction('room_exit', { roomId, timestamp: Date.now() })
      }
    }
  }, [roomId, onInteraction])

  return (
    <div 
      className={cn(
        'relative bg-gradient-to-br from-black via-gray-900 to-black backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 flex items-center justify-center transition-all duration-500',
        className
      )}
      style={{
        height,
        boxShadow: `0 0 40px ${accentColor}20`,
        borderColor: `${accentColor}40`
      }}
    >
      {/* Placeholder 3D Room Visualization */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8h1m4 0h1" 
                />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">
            {roomData?.name || 'Virtual Room'}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4">
            {roomData?.description || '3D virtual space coming soon'}
          </p>
          
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
            <span className="bg-purple-500/20 px-2 py-1 rounded-full">
              {roomData?.room_type || 'Gallery'}
            </span>
            {roomData?.visit_count && (
              <span>{roomData.visit_count} visits</span>
            )}
          </div>
        </div>
        
        {/* Mock 3D perspective grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${accentColor}10, transparent)`
            }}
          />
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `
                linear-gradient(90deg, ${accentColor}20 1px, transparent 1px),
                linear-gradient(${accentColor}20 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center bottom'
            }}
          />
        </div>
      </div>

      {/* Controls hint */}
      {enableControls && (
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <p className="text-white text-sm font-medium mb-1">3D Mode</p>
          <p className="text-gray-300 text-xs">
            Full 3D experience coming soon
          </p>
        </div>
      )}
      
      {/* Room info */}
      {roomData && (
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-white font-semibold">{roomData.name}</h3>
          {roomData.description && (
            <p className="text-gray-300 text-sm mt-1">{roomData.description}</p>
          )}
        </div>
      )}
      
      {/* Development notice */}
      <div className="absolute top-4 right-4 bg-yellow-500/20 backdrop-blur-sm rounded-lg p-2 text-xs text-yellow-300">
        Preview Mode
      </div>
    </div>
  )
}