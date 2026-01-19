import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComposerBox from './ComposerBox';
import * as AuthContextModule from '../../contexts/AuthContext';
import { socialApi } from '../../lib/api';
import { BrowserRouter } from 'react-router-dom';

// Mock dependencies
vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
  AuthContext: {
    Provider: ({ children }: any) => children,
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ImageIcon: () => <span data-testid="icon-image" />,
  Smile: () => <span data-testid="icon-smile" />,
  Calendar: () => <span data-testid="icon-calendar" />,
  MapPin: () => <span data-testid="icon-map" />,
  BarChart2: () => <span data-testid="icon-chart" />,
}));

describe('ComposerBox', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
  };

  const mockProfile = {
    full_name: 'Test User',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (authUser = mockUser) => {
    // @ts-expect-error - Mocking read-only property for testing
    AuthContextModule.useAuth.mockReturnValue({
        user: authUser,
        profile: authUser ? mockProfile : null,
    });

    return render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );
  };

  it('renders correctly when logged in', () => {
    renderComponent();
    expect(screen.getByPlaceholderText("What's happening in your creative world?")).toBeInTheDocument();
    // Using regex with strict start/end to avoid partial matches on other buttons like "Schedule post"
    expect(screen.getByRole('button', { name: /^post$/i })).toBeInTheDocument();
  });

  it('renders login prompt when not logged in', () => {
    renderComponent(null);
    expect(screen.getByText('Sign in to share your creative thoughts')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
  });

  it('updates character count and progress ring', () => {
    renderComponent();
    const input = screen.getByPlaceholderText("What's happening in your creative world?");

    // Type some text
    fireEvent.change(input, { target: { value: 'Hello world' } });

    // Check if progress ring circles exist
    const circles = document.querySelectorAll('circle');
    expect(circles.length).toBe(2);
  });

  it('shows countdown text when approaching limit', () => {
    renderComponent();
    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    const maxChars = 280;
    const nearLimitText = 'a'.repeat(maxChars - 10); // 270 chars

    fireEvent.change(input, { target: { value: nearLimitText } });

    // The specific countdown number should be visible now
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('disables post button when empty or too long', () => {
    renderComponent();
    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    const button = screen.getByRole('button', { name: /^post$/i });

    // Empty
    expect(button).toBeDisabled();

    // Valid
    fireEvent.change(input, { target: { value: 'Valid post' } });
    expect(button).not.toBeDisabled();

    // Too long
    fireEvent.change(input, { target: { value: 'a'.repeat(281) } });
    expect(button).toBeDisabled();
  });

  it('handles post submission', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText("What's happening in your creative world?");
    const button = screen.getByRole('button', { name: /^post$/i });

    fireEvent.change(input, { target: { value: 'New post' } });
    fireEvent.click(button);

    expect(socialApi.createPost).toHaveBeenCalledWith('New post');

    await waitFor(() => {
        expect(input).toHaveValue('');
    });
  });
});
