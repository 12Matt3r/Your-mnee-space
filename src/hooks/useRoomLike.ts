import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export const useRoomLike = (roomId: string) => {
  const { user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && roomId) {
      checkLikeStatus()
    }
  }, [user, roomId])

  const checkLikeStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('room_likes')
        .select('*')
        .eq('room_id', roomId)
        .eq('user_id', user!.id)
        .maybeSingle()

      if (error) throw error
      setLiked(!!data)
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }

  const toggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like rooms')
      return
    }

    setLoading(true)
    try {
      if (liked) {
        const { error } = await supabase
          .from('room_likes')
          .delete()
          .eq('room_id', roomId)
          .eq('user_id', user.id)

        if (error) throw error
        setLiked(false)
        toast.success('Removed from favorites')
      } else {
        const { error } = await supabase
          .from('room_likes')
          .insert({ room_id: roomId, user_id: user.id })

        if (error) throw error
        setLiked(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      toast.error('Failed to update like status')
    } finally {
      setLoading(false)
    }
  }

  return { liked, toggleLike, loading }
}
