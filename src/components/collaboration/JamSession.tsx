import React, { useState, useEffect } from 'react'
import { PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, MusicalNoteIcon } from '@heroicons/react/24/solid'
import { supabase } from '../../lib/supabase'

interface JamSessionProps {
  sessionId: string
}

export const JamSession: React.FC<JamSessionProps> = ({ sessionId }) => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Tracks state managed locally and synced via Realtime
  const [tracks, setTracks] = useState([
    { id: 1, name: 'Drum Loop A', active: true, color: 'bg-blue-500' },
    { id: 2, name: 'Bassline Synth', active: true, color: 'bg-purple-500' },
    { id: 3, name: 'Lead Melody', active: false, color: 'bg-pink-500' },
    { id: 4, name: 'Pad Textures', active: false, color: 'bg-teal-500' }
  ])

  useEffect(() => {
    const channel = supabase.channel(`jam:${sessionId}`)
      .on('broadcast', { event: 'toggle_track' }, ({ payload }) => {
        setTracks(current =>
          current.map((t, i) => i === payload.index ? { ...t, active: !t.active } : t)
        )
      })
      .on('broadcast', { event: 'play_pause' }, ({ payload }) => {
        setIsPlaying(payload.isPlaying)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  const toggleTrack = (index: number) => {
    const newTracks = [...tracks]
    newTracks[index].active = !newTracks[index].active
    setTracks(newTracks)

    supabase.channel(`jam:${sessionId}`).send({
      type: 'broadcast',
      event: 'toggle_track',
      payload: { index }
    })
  }

  const togglePlay = () => {
    const newState = !isPlaying
    setIsPlaying(newState)

    supabase.channel(`jam:${sessionId}`).send({
      type: 'broadcast',
      event: 'play_pause',
      payload: { isPlaying: newState }
    })
  }

  return (
    <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <MusicalNoteIcon className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-bold">Live Jam Session</h3>
            <p className="text-xs text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Sync Active
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-black/40 rounded-full text-xs text-gray-400 border border-purple-500/20">
            120 BPM
          </div>
          <div className="px-3 py-1 bg-black/40 rounded-full text-xs text-gray-400 border border-purple-500/20">
            4/4
          </div>
        </div>
      </div>

      {/* Sequencer Grid Visualizer */}
      <div className="flex-1 bg-[#111] rounded-lg border border-gray-800 p-2 mb-4 relative overflow-hidden">
        {/* Playhead */}
        <div
          className={`absolute top-0 bottom-0 w-0.5 bg-white z-10 transition-all duration-[2000ms] ease-linear ${
            isPlaying ? 'left-full' : 'left-0'
          }`}
          style={{ transitionProperty: 'left' }}
        />

        <div className="grid grid-rows-4 gap-2 h-full">
          {tracks.map((track, i) => (
            <div key={track.id} className="flex space-x-1 h-full items-center">
              <div
                className={`w-24 px-2 py-1 text-xs font-medium rounded cursor-pointer transition-all ${
                  track.active ? 'text-white bg-white/10' : 'text-gray-500 bg-black/20'
                }`}
                onClick={() => toggleTrack(i)}
              >
                {track.name}
              </div>
              <div className="flex-1 grid grid-cols-16 gap-0.5 h-full">
                {[...Array(16)].map((_, step) => (
                  <div
                    key={step}
                    className={`rounded-sm transition-opacity ${
                      track.active && (step % 4 === 0 || Math.random() > 0.7)
                        ? `${track.color} opacity-80`
                        : 'bg-gray-800 opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button className="p-3 hover:bg-white/10 rounded-full text-gray-300 transition-colors">
          <BackwardIcon className="h-6 w-6" />
        </button>
        <button
          onClick={togglePlay}
          className={`p-4 rounded-full text-white shadow-lg shadow-purple-500/20 transition-all ${
            isPlaying ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isPlaying ? <PauseIcon className="h-8 w-8" /> : <PlayIcon className="h-8 w-8" />}
        </button>
        <button className="p-3 hover:bg-white/10 rounded-full text-gray-300 transition-colors">
          <ForwardIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
