import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MusicPlayer from './MusicPlayer';
import * as MusicPlayerContext from '../../contexts/MusicPlayerContext';

// Mock the context hook
vi.mock('../../contexts/MusicPlayerContext', () => ({
  useMusicPlayer: vi.fn(),
  MusicPlayerProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock lucide-react icons to avoid rendering issues and simplify snapshots if needed
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
  const mockOnClose = vi.fn();

  const defaultContextValues = {
    isPlaying: false,
    currentTrack: { id: '1', title: 'Test Track', artist: 'Test Artist', thumbnail: '', duration: 100, url: '' },
    currentTime: 0,
    duration: 100,
    volume: 50,
    isLoading: false,
    isShuffle: false,
    repeatMode: 'none',
    playlist: [
      { id: '1', title: 'Test Track', artist: 'Test Artist', thumbnail: '', duration: 100, url: '' },
      { id: '2', title: 'Another Track', artist: 'Another Artist', thumbnail: '', duration: 150, url: '' },
    ],
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
    vi.clearAllMocks();
    (MusicPlayerContext.useMusicPlayer as any).mockReturnValue(defaultContextValues);
  });

  it('renders all main control buttons with accessible labels', () => {
    render(<MusicPlayer onClose={mockOnClose} />);

    // Check for main controls
    expect(screen.getByRole('button', { name: /close player/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle shuffle/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Play$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /toggle repeat/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mute volume/i })).toBeInTheDocument();
  });

  it('renders pause button label when playing', () => {
    (MusicPlayerContext.useMusicPlayer as any).mockReturnValue({
      ...defaultContextValues,
      isPlaying: true,
    });

    render(<MusicPlayer onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
  });

  it('renders playlist items as accessible buttons', () => {
    render(<MusicPlayer onClose={mockOnClose} />);

    const playlistItems = screen.getAllByRole('button', { name: /play .+/i });
    expect(playlistItems).toHaveLength(2);
    expect(playlistItems[0]).toHaveAttribute('aria-label', 'Play Test Track by Test Artist');
    expect(playlistItems[1]).toHaveAttribute('aria-label', 'Play Another Track by Another Artist');
  });

  it('indicates active shuffle state via aria-pressed or label', () => {
    (MusicPlayerContext.useMusicPlayer as any).mockReturnValue({
      ...defaultContextValues,
      isShuffle: true,
    });

    render(<MusicPlayer onClose={mockOnClose} />);
    const shuffleButton = screen.getByRole('button', { name: /toggle shuffle/i });
    // Assuming we'll add aria-pressed for state indication
    expect(shuffleButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('indicates active repeat state', () => {
    (MusicPlayerContext.useMusicPlayer as any).mockReturnValue({
      ...defaultContextValues,
      repeatMode: 'all',
    });

    render(<MusicPlayer onClose={mockOnClose} />);
    const repeatButton = screen.getByRole('button', { name: /toggle repeat/i });
    expect(repeatButton).toHaveAttribute('aria-pressed', 'true');
  });
});
