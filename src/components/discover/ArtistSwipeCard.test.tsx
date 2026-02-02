import { render, screen } from '@testing-library/react'
import { ArtistSwipeCard } from './ArtistSwipeCard'
import { BrowserRouter } from 'react-router-dom'
import { Profile } from '../../lib/supabase'
import { describe, it, expect } from 'vitest'

// Mock artist profile
const mockArtist: Profile = {
  id: '123',
  username: 'testartist',
  display_name: 'Test Artist',
  full_name: 'Test Artist Full',
  bio: 'A test artist bio',
  avatar_url: 'https://example.com/avatar.jpg',
  background_image_url: null,
  background_video_url: null,
  theme: 'dark',
  custom_css: null,
  creator_type: 'musician',
  is_verified: true,
  is_premium: false,
  profile_views: 100,
  follower_count: 50,
  following_count: 10,
  total_earnings: 0,
  reputation_score: 10,
  wallet_address: '0x123',
  mnee_balance: 0,
  created_at: '2023-01-01',
  updated_at: '2023-01-01'
}

describe('ArtistSwipeCard', () => {
  it('renders accessible buttons with ARIA labels', () => {
    render(
      <BrowserRouter>
        <ArtistSwipeCard
          artist={mockArtist}
          onSwipe={() => {}}
          isTop={true}
        />
      </BrowserRouter>
    )

    // Check for Pass button
    expect(screen.getByLabelText('Pass')).toBeInTheDocument()
    expect(screen.getByTitle('Pass')).toBeInTheDocument()

    // Check for Like button
    expect(screen.getByLabelText('Like')).toBeInTheDocument()
    expect(screen.getByTitle('Like')).toBeInTheDocument()

    // Check for Visit Studio link
    expect(screen.getByLabelText("Visit Test Artist's studio")).toBeInTheDocument()
  })

  it('renders without actions when not top card', () => {
    render(
      <BrowserRouter>
        <ArtistSwipeCard
          artist={mockArtist}
          onSwipe={() => {}}
          isTop={false}
        />
      </BrowserRouter>
    )

    // Buttons should not be present
    expect(screen.queryByLabelText('Pass')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Like')).not.toBeInTheDocument()
  })
})
