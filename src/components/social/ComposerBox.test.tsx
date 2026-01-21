import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ComposerBox from './ComposerBox';
import React from 'react';

// Mock dependencies
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    profile: {
      full_name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  })
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: vi.fn().mockResolvedValue({})
  }
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('ComposerBox', () => {
  it('renders the composer when user is logged in', () => {
    render(<ComposerBox />);
    expect(screen.getByPlaceholderText(/What's happening/i)).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('updates character count', () => {
    render(<ComposerBox />);
    const textarea = screen.getByPlaceholderText(/What's happening/i);

    // Initial state: 280 characters remaining
    expect(screen.getByText('280')).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Hello' } });
    expect(screen.getByText('275')).toBeInTheDocument();
  });
});
