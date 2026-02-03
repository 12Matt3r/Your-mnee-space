import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ComposerBox from './ComposerBox';

// Mock dependencies
const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
};

const mockProfile = {
  id: 'user-123',
  full_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
};

const mockCreatePost = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    profile: mockProfile,
  }),
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: (...args: any[]) => mockCreatePost(...args),
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
    // Use regex for button text because it might change slightly or have extra whitespace
    expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
  });

  it('updates text input', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(textarea).toHaveValue('Hello world');
  });

  it('calls createPost when form is submitted', async () => {
    mockCreatePost.mockResolvedValue({});

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(textarea, { target: { value: 'New post content' } });

    const postButton = screen.getByRole('button', { name: /^Post$/i });
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(mockCreatePost).toHaveBeenCalledWith('New post content');
    });
  });

  it('disables button when input is empty', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const postButton = screen.getByRole('button', { name: /^Post$/i });
    expect(postButton).toBeDisabled();
  });
});
