import React from 'react';
import { render, screen } from '@testing-library/react';
import { AudioPlayerWidget } from './AudioPlayerWidget';
import { describe, it, expect } from 'vitest';

const mockWidget = {
  id: 'test-widget',
  type: 'audio-player',
  data: {
    tracks: [
      {
        id: '1',
        title: 'Test Track 1',
        artist: 'Artist 1',
        duration: '3:00',
        genre: 'Pop',
        plays: 1000,
        likes: 10,
        waveform: Array(60).fill(50)
      },
      {
        id: '2',
        title: 'Test Track 2',
        artist: 'Artist 2',
        duration: '4:00',
        genre: 'Rock',
        plays: 2000,
        likes: 20,
        waveform: Array(60).fill(50)
      }
    ]
  }
};

describe('AudioPlayerWidget Accessibility', () => {
  it('has accessible controls', () => {
    render(<AudioPlayerWidget widget={mockWidget as any} />);

    // These should exist after my changes
    // Note: getByRole throws if not found, effectively failing the test
    expect(screen.getByRole('button', { name: /play|pause/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous track/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next track/i })).toBeInTheDocument();

    // Volume slider
    expect(screen.getByRole('slider', { name: /volume/i })).toBeInTheDocument();

    // Like button (starts as 'Like track' presumably)
    // We use a regex to match "Like track" or similar
    expect(screen.getByRole('button', { name: /like/i })).toBeInTheDocument();
  });
});
