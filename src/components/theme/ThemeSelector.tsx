import React, { useState } from 'react'
import { useTheme, NEON_COLORS } from '../../lib/theme'
import { SparklesIcon, PaintBrushIcon } from '@heroicons/react/24/outline'
import { cn } from '../../lib/utils'

export const ThemeSelector = () => {
  const { currentTheme, setTheme, isDarkMode, toggleDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = Object.keys(NEON_COLORS.primary) as Array<keyof typeof NEON_COLORS.primary>

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize Vibe"
        className="p-2 rounded-lg bg-black/30 hover:bg-black/50 border border-purple-500/20 hover:border-purple-500/50 transition-all text-purple-300"
        title="Customize Vibe"
      >
        <PaintBrushIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold flex items-center">
              <SparklesIcon className="h-4 w-4 mr-2 text-yellow-400" />
              Vibe Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close settings"
              className="text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Color Themes */}
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">
                Neon Palette
              </label>
              <div className="grid grid-cols-5 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setTheme(theme)}
                    aria-label={`Select ${theme} theme`}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                      currentTheme === theme ? 'border-white scale-110' : 'border-transparent'
                    )}
                    style={{ backgroundColor: NEON_COLORS.primary[theme] }}
                    title={theme}
                  />
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-800">
              <span className="text-sm text-gray-300">Dark Mode</span>
              <button
                onClick={toggleDarkMode}
                aria-pressed={isDarkMode}
                aria-label="Toggle dark mode"
                className={cn(
                  'w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out',
                  isDarkMode ? 'bg-purple-600' : 'bg-gray-600'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out',
                    isDarkMode ? 'translate-x-6' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
