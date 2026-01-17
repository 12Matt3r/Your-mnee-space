import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MusicPlayer from './MusicPlayer';
import { useMusicPlayer } from '../../contexts/MusicPlayerContext';
import { YouTubeTrack } from '../../data/youtubePlaylist';

// Mock the MusicPlayerContext
vi.mock('../../contexts/MusicPlayerContext', () => ({
  useMusicPlayer: vi.fn(),
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Play: () => <span data-testid="icon-play">Play</span>,
  Pause: () => <span data-testid="icon-pause">Pause</span>,
  SkipBack: () => <span data-testid="icon-skip-back">SkipBack</span>,
  SkipForward: () => <span data-testid="icon-skip-forward">SkipForward</span>,
  Volume2: () => <span data-testid="icon-volume-2">Volume2</span>,
  VolumeX: () => <span data-testid="icon-volume-x">VolumeX</span>,
  Repeat: () => <span data-testid="icon-repeat">Repeat</span>,
  Shuffle: () => <span data-testid="icon-shuffle">Shuffle</span>,
  X: () => <span data-testid="icon-x">X</span>,
  Music: () => <span data-testid="icon-music">Music</span>,
  Clock: () => <span data-testid="icon-clock">Clock</span>,
  Radio: () => <span data-testid="icon-radio">Radio</span>,
}));

describe('MusicPlayer Accessibility', () => {
  const mockTrack: YouTubeTrack = {
    id: '1',
    videoId: 'test',
    title: 'Unique Track Title',
    artist: 'Test Artist',
  };

  const defaultContext = {
    isPlaying: false,
    currentTrack: mockTrack,
    currentTime: 0,
    duration: 100,
    volume: 50,
    isLoading: false,
    isShuffle: false,
    repeatMode: 'none' as const,
    playlist: [mockTrack, { ...mockTrack, id: '2', title: 'Other Track' }],
    currentIndex: 0,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    setVolume: vi.fn(),
    seek: vi.fn(),
    nextTrack: vi.fn(),
    previousTrack: vi.fn(),
    toggleShuffle: vi.fn(),
    toggleRepeat: vi.fn(),
    playTrackByIndex: vi.fn(),
    playTrack: vi.fn(),
  };

  beforeEach(() => {
    (useMusicPlayer as any).mockReturnValue(defaultContext);
  });

  it('renders with accessible buttons', () => {
    render(<MusicPlayer onClose={vi.fn()} />);

    // Check for ARIA labels on controls
    expect(screen.getByLabelText(/close player/i)).toBeDefined();
    expect(screen.getByLabelText(/toggle shuffle/i)).toBeDefined();
    expect(screen.getByLabelText(/previous track/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /^play$/i })).toBeDefined();
    expect(screen.getByLabelText(/next track/i)).toBeDefined();
    expect(screen.getByLabelText(/toggle repeat/i)).toBeDefined();
    expect(screen.getByLabelText(/mute volume/i)).toBeDefined();

    // Check volume slider
    const slider = screen.getByRole('slider');
    expect(slider).toBeDefined();
    expect(screen.getByLabelText(/volume control/i)).toBeDefined();
  });

  it('renders playlist items as buttons', () => {
    render(<MusicPlayer onClose={vi.fn()} />);

    // Find the playlist item "Other Track" which should only be in the playlist list
    const playlistItemText = screen.getByText('Other Track');
    const playlistItemButton = playlistItemText.closest('button');

    expect(playlistItemButton).toBeDefined();
    expect(playlistItemButton).not.toBeNull();
  });
});
