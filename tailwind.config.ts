// YourSpace Creative Labs - Tailwind CSS Configuration
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mnee: {
          gold: '#FFD700',
          goldLight: '#FFE44D',
          goldDark: '#B8860B',
          blue: '#0066FF',
          blueLight: '#3385FF',
          blueDark: '#0052CC',
          black: '#0A0B0D',
          charcoal: '#141619',
          slate: '#1A1D21',
          white: '#FFFFFF',
          gray: '#8B919A',
        },
      },
      backgroundImage: {
        'gradient-mnee': 'linear-gradient(135deg, #FFD700 0%, #0066FF 50%, #0A0B0D 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FFE44D 0%, #FFD700 50%, #B8860B 100%)',
        'gradient-sleek': 'linear-gradient(180deg, #141619 0%, #0A0B0D 100%)',
        'gradient-matte': 'linear-gradient(135deg, #1A1D21 0%, #141619 50%, #0A0B0D 100%)',
      },
      boxShadow: {
        'mnee-gold': '0 0 20px rgba(255, 215, 0, 0.3)',
        'mnee-gold-lg': '0 0 40px rgba(255, 215, 0, 0.4)',
        'mnee-blue': '0 0 20px rgba(0, 102, 255, 0.3)',
        'mnee-blue-lg': '0 0 40px rgba(0, 102, 255, 0.4)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'gradient-shift': 'gradientShift 15s ease infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite alternate',
        'pulse-blue': 'pulseBlue 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradientShift: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        pulseGold: {
          'from': { filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' },
          'to': { filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))' },
        },
        pulseBlue: {
          'from': { filter: 'drop-shadow(0 0 10px rgba(0, 102, 255, 0.5))' },
          'to': { filter: 'drop-shadow(0 0 20px rgba(0, 102, 255, 0.8))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        hologramShift: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

export default config