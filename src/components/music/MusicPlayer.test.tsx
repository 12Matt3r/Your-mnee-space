import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MusicPlayer from './MusicPlayer';

// Mock the icons
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

// Mock the context
const mockMusicPlayer = {
  isPlaying: false,
  currentTrack: {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    url: 'http://test.com/track.mp3',
    thumbnailUrl: 'http://test.com/thumb.jpg',
    duration: 120,
  },
  currentTime: 30,
  duration: 120,
  volume: 50,
  isLoading: false,
  isShuffle: false,
  repeatMode: 'none',
  playlist: [
    {
      id: '1',
      title: 'Test Track',
      artist: 'Test Artist',
      url: 'http://test.com/track.mp3',
      thumbnailUrl: 'http://test.com/thumb.jpg',
      duration: 120,
    },
    {
      id: '2',
      title: 'Track 2',
      artist: 'Artist 2',
      url: 'http://test.com/track2.mp3',
      thumbnailUrl: 'http://test.com/thumb2.jpg',
      duration: 180,
    },
  ],
  currentIndex: 0,
  play: vi.fn(),
  pause: vi.fn(),
  nextTrack: vi.fn(),
  previousTrack: vi.fn(),
  toggleShuffle: vi.fn(),
  toggleRepeat: vi.fn(),
  setVolume: vi.fn(),
  seek: vi.fn(),
  playTrackByIndex: vi.fn(),
};

vi.mock('../../contexts/MusicPlayerContext', () => ({
  useMusicPlayer: () => mockMusicPlayer,
}));

describe('MusicPlayer Accessibility', () => {
  const onCloseMock = vi.fn();

  it('renders all interactive elements with accessible labels', () => {
    render(<MusicPlayer onClose={onCloseMock} />);

    // Close button
    expect(screen.getByLabelText(/^close player$/i)).toBeInTheDocument();

    // Shuffle button
    expect(screen.getByLabelText(/enable shuffle|disable shuffle/i)).toBeInTheDocument();

    // Previous button
    expect(screen.getByLabelText(/^previous track$/i)).toBeInTheDocument();

    // Play/Pause button - check specifically for the button with name "Play" or "Pause"
    // Since playlist items also start with "Play", we need to be careful.
    // However, getByLabelText with exact match or regex anchor should work if the labels are distinct.
    // Playlist items are "Play [Track] by [Artist]", Main button is "Play"
    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument();

    // Next button
    expect(screen.getByLabelText(/^next track$/i)).toBeInTheDocument();

    // Repeat button
    expect(screen.getByLabelText(/repeat mode:/i)).toBeInTheDocument();

    // Mute/Volume button
    expect(screen.getByLabelText(/mute|unmute/i)).toBeInTheDocument();

    // Volume slider
    expect(screen.getByLabelText(/volume control/i)).toBeInTheDocument();
  });

  it('renders playlist items as buttons for keyboard accessibility', () => {
    render(<MusicPlayer onClose={onCloseMock} />);

    // Check if playlist items are clickable via keyboard (buttons)
    // The regex should match "Play Test Track by Test Artist"
    const playlistItems = screen.getAllByRole('button', { name: /play.*by.*/i });
    expect(playlistItems.length).toBeGreaterThan(0);
    expect(playlistItems[0]).toHaveAttribute('aria-label', 'Play Test Track by Test Artist');
  });
});
