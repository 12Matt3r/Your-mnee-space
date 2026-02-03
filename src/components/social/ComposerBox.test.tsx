import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ComposerBox from './ComposerBox';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
const mockCreatePost = vi.fn();

// We need to use vi.hoisted for variables used in mocks if they are referenced outside,
// but here we can just define the mock implementation inline or use a helper if needed.
// For simplicity, we'll mock the module.

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: (...args: any[]) => mockCreatePost(...args),
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { email: 'test@example.com' },
    profile: {
        full_name: 'Test User',
        avatar_url: 'http://example.com/avatar.jpg'
    }
  }),
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
    expect(screen.getByPlaceholderText(/What's happening in your creative world/i)).toBeInTheDocument();
    // Use regex to match strictly "Post" and not "Schedule post"
    expect(screen.getByRole('button', { name: /^Post$/i })).toBeInTheDocument();
  });

  it('enables post button when text is entered', () => {
    render(
        <BrowserRouter>
          <ComposerBox />
        </BrowserRouter>
      );
      const input = screen.getByPlaceholderText(/What's happening in your creative world/i);
      const button = screen.getByRole('button', { name: /^Post$/i });

      expect(button).toBeDisabled();

      fireEvent.change(input, { target: { value: 'Hello world' } });
      expect(button).not.toBeDisabled();
  });

  it('updates character count', () => {
    render(
        <BrowserRouter>
          <ComposerBox />
        </BrowserRouter>
      );
    const input = screen.getByPlaceholderText(/What's happening in your creative world/i);
    // 280 chars max.
    expect(screen.getByText('280')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Hi' } });
    expect(screen.getByText('278')).toBeInTheDocument();
  });

  it('calls createPost when form is submitted', async () => {
    render(
        <BrowserRouter>
          <ComposerBox />
        </BrowserRouter>
      );
    const input = screen.getByPlaceholderText(/What's happening in your creative world/i);
    const button = screen.getByRole('button', { name: /^Post$/i });

    fireEvent.change(input, { target: { value: 'Hello world' } });
    fireEvent.click(button);

    await waitFor(() => {
        expect(mockCreatePost).toHaveBeenCalledWith('Hello world');
    });
  });
});
