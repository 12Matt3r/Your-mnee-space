import React, { useRef, useEffect, useState } from 'react'
import { PencilIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { supabase } from '../../lib/supabase'

interface SharedCanvasProps {
  sessionId: string
  isActive?: boolean
}

interface DrawEvent {
  prevX: number
  prevY: number
  currX: number
  currY: number
  color: string
  width: number
}

export const SharedCanvas: React.FC<SharedCanvasProps> = ({ sessionId, isActive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#8B5CF6') // Purple
  const [brushSize, setBrushSize] = useState(2)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const prevPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set initial canvas setup
    canvas.width = canvas.parentElement?.clientWidth || 800
    canvas.height = canvas.parentElement?.clientHeight || 600

    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = color
    ctx.lineWidth = brushSize

    setContext(ctx)

    // Setup Supabase Realtime
    const channel = supabase.channel(`canvas:${sessionId}`)
      .on('broadcast', { event: 'draw' }, ({ payload }) => {
        drawRemote(payload)
      })
      .on('broadcast', { event: 'clear' }, () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      })
      .subscribe()

    // Handle resize
    const handleResize = () => {
      // Save content
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Resize
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = canvas.parentElement?.clientHeight || 600

      // Restore settings and content
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = color
      ctx.lineWidth = brushSize
      ctx.putImageData(imageData, 0, 0)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  useEffect(() => {
    if (context) {
      context.strokeStyle = color
      context.lineWidth = brushSize
    }
  }, [color, brushSize, context])

  const drawRemote = (event: DrawEvent) => {
    if (!context || !canvasRef.current) return

    const prevStyle = context.strokeStyle
    const prevWidth = context.lineWidth

    context.strokeStyle = event.color
    context.lineWidth = event.width

    context.beginPath()
    context.moveTo(event.prevX, event.prevY)
    context.lineTo(event.currX, event.currY)
    context.stroke()
    context.closePath()

    context.strokeStyle = prevStyle
    context.lineWidth = prevWidth
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!context || !isActive) return

    const { offsetX, offsetY } = e.nativeEvent
    prevPos.current = { x: offsetX, y: offsetY }
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context || !isActive) return

    const { offsetX, offsetY } = e.nativeEvent

    // Draw locally
    context.beginPath()
    context.moveTo(prevPos.current.x, prevPos.current.y)
    context.lineTo(offsetX, offsetY)
    context.stroke()
    context.closePath()

    // Broadcast
    const event: DrawEvent = {
      prevX: prevPos.current.x,
      prevY: prevPos.current.y,
      currX: offsetX,
      currY: offsetY,
      color: color,
      width: brushSize
    }

    supabase.channel(`canvas:${sessionId}`).send({
      type: 'broadcast',
      event: 'draw',
      payload: event
    })

    prevPos.current = { x: offsetX, y: offsetY }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    if (context && canvasRef.current) {
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      supabase.channel(`canvas:${sessionId}`).send({
        type: 'broadcast',
        event: 'clear',
        payload: {}
      })
    }
  }

  return (
    <div className="flex flex-col h-full bg-black/20 rounded-xl overflow-hidden border border-purple-500/20">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-black/40 border-b border-purple-500/20">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-black/30 rounded-lg p-1">
            {['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#FFFFFF'].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  color === c ? 'border-white scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="h-6 w-px bg-gray-700 mx-2" />

          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-purple-500"
            />
            <span className="text-xs text-gray-400 w-4">{brushSize}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={clearCanvas}
            className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
            title="Clear Canvas"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative cursor-crosshair bg-[#1a1a1a]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="absolute inset-0"
        />
        {!isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-gray-400">Read-only mode</p>
          </div>
        )}
      </div>
    </div>
  )
}
