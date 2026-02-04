import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComposerBox from './ComposerBox';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies using vi.hoisted to avoid hoisting issues
const { mockCreatePost, mockUser, mockProfile } = vi.hoisted(() => {
  return {
    mockCreatePost: vi.fn(),
    mockUser: { email: 'test@example.com' },
    mockProfile: { full_name: 'Test User', avatar_url: 'https://example.com/avatar.png' }
  }
})

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    profile: mockProfile,
  }),
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: mockCreatePost,
  },
}));

describe('ComposerBox', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with user profile', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("What's happening in your creative world?")).toBeInTheDocument();
    expect(screen.getByAltText('Your avatar')).toHaveAttribute('src', mockProfile.avatar_url);
    expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
  });

  it('disables post button when input is empty', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const postButton = screen.getByRole('button', { name: /^Post$/i });
    expect(postButton).toBeDisabled();
  });

  it('enables post button when input has text', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(input, { target: { value: 'Hello world' } });

    const postButton = screen.getByRole('button', { name: /^Post$/i });
    expect(postButton).not.toBeDisabled();
  });

  it('shows loading spinner when posting', async () => {
    // Delay resolution to capture loading state
    mockCreatePost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(input, { target: { value: 'Hello world' } });

    const postButton = screen.getByRole('button', { name: /^Post$/i });
    fireEvent.click(postButton);

    expect(mockCreatePost).toHaveBeenCalled();
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
    expect(postButton).toBeDisabled();

    await waitFor(() => {
        expect(screen.queryByRole('status', { name: /loading/i })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
        // Button should be disabled because text is cleared on success
        expect(postButton).toBeDisabled();
    });
  });
});
