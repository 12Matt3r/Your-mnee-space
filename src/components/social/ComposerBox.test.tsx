import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ComposerBox from './ComposerBox';
import { BrowserRouter } from 'react-router-dom';

// Mock the dependencies
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    profile: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }))
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: vi.fn().mockResolvedValue({ id: 'new-post-id' })
  }
}));

describe('ComposerBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("What's happening in your creative world?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
  });

  it('updates text input', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(input).toHaveValue('Hello world');
  });

  it('handles post submission', async () => {
    const { socialApi } = await import('../../lib/api');

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(input, { target: { value: 'New post content' } });

    const submitBtn = screen.getByRole('button', { name: /^Post$/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(socialApi.createPost).toHaveBeenCalledWith('New post content');
    });

    // Check if input is cleared
    expect(input).toHaveValue('');
  });
});
