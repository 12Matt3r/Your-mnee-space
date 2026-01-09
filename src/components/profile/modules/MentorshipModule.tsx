import React, { useState } from 'react'
import { AcademicCapIcon, CalendarIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { formatMneeWithUsd } from '../../../lib/mnee'
import toast from 'react-hot-toast'

interface MentorshipOption {
  id: string
  title: string
  duration: string
  price: number
  description: string
}

interface MentorshipModuleProps {
  creatorName: string
  options?: MentorshipOption[]
}

const defaultOptions: MentorshipOption[] = [
  {
    id: '1',
    title: 'Portfolio Review',
    duration: '30 min',
    price: 50,
    description: 'Get detailed feedback on your creative work and profile.'
  },
  {
    id: '2',
    title: '1:1 Coaching',
    duration: '60 min',
    price: 100,
    description: 'Deep dive into your creative process and career goals.'
  },
  {
    id: '3',
    title: 'Vibe Code Session',
    duration: '45 min',
    price: 75,
    description: 'Learn how to customize your room and create atmosphere.'
  }
]

export const MentorshipModule: React.FC<MentorshipModuleProps> = ({
  creatorName,
  options = defaultOptions
}) => {
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleBook = async (option: MentorshipOption) => {
    setBookingId(option.id)
    setLoading(true)
    setSuccess(false)

    // Simulate Payment & Booking Flow (Fiat -> MNEE)
    await new Promise(resolve => setTimeout(resolve, 2000))

    setLoading(false)
    setSuccess(true)
    toast.success('Session booked successfully!')

    setTimeout(() => {
      setSuccess(false)
      setBookingId(null)
    }, 3000)
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <AcademicCapIcon className="h-6 w-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Mentorship & Services</h3>
          <p className="text-gray-400 text-sm">Learn directly from {creatorName}</p>
        </div>
      </div>

      <div className="space-y-4">
        {options.map((option) => (
          <div
            key={option.id}
            className="group p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-xl transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                  {option.title}
                </h4>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  {option.duration}
                </div>
              </div>
              <div className="text-right">
                <span className="block text-lg font-bold text-white">
                  ${option.price}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">
              {option.description}
            </p>

            {bookingId === option.id && loading ? (
              <div className="w-full py-2 bg-purple-500/20 rounded-lg flex items-center justify-center space-x-2">
                <ArrowPathIcon className="h-4 w-4 text-purple-400 animate-spin" />
                <span className="text-sm text-purple-300">
                  Processing {formatMneeWithUsd(option.price)}...
                </span>
              </div>
            ) : bookingId === option.id && success ? (
              <div className="w-full py-2 bg-green-500/20 rounded-lg flex items-center justify-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-300">Booked! Check email.</span>
              </div>
            ) : (
              <button
                onClick={() => handleBook(option)}
                disabled={loading}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Book Session
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
