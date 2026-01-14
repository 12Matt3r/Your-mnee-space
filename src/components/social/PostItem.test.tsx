import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import PostItem from './PostItem';
import { PostWithInteractions } from '../../types/social';
import React from 'react';

// Mock dependencies
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    likePost: vi.fn(),
    unlikePost: vi.fn(),
    bookmarkPost: vi.fn(),
    unbookmarkPost: vi.fn(),
  },
}));

vi.mock('../web3/MneeTransactionButton', () => ({
  MneeTransactionButton: () => <button>MNEE Button</button>,
}));

// Mock PostContent and PollDisplay to simplify
vi.mock('./PostContent', () => ({
  default: ({ text }: { text: string }) => <div>{text}</div>,
}));

vi.mock('./PollDisplay', () => ({
  default: () => <div>Poll</div>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Heart: () => <span data-testid="icon-heart">Heart</span>,
  MessageCircle: () => <span data-testid="icon-message">Message</span>,
  Repeat2: () => <span data-testid="icon-repeat">Repeat</span>,
  Share: () => <span data-testid="icon-share">Share</span>,
  Bookmark: () => <span data-testid="icon-bookmark">Bookmark</span>,
  MoreHorizontal: () => <span data-testid="icon-more">More</span>,
  Coins: () => <span data-testid="icon-coins">Coins</span>,
}));

// Mock useAuth
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'me', email: 'me@example.com' },
    profile: null,
    session: null,
    loading: false,
    isAdmin: false,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    demoLogin: vi.fn(),
    updateProfile: vi.fn(),
  }),
}));

const mockPost: PostWithInteractions = {
  id: '123',
  user_id: 'user1',
  content: 'Hello World',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  likes_count: 5,
  replies_count: 2,
  bookmarks_count: 1,
  is_liked: false,
  is_bookmarked: false,
  profiles: {
    user_id: 'user1',
    full_name: 'Test User',
    username: 'testuser',
    avatar_url: 'http://example.com/avatar.jpg',
    wallet_address: '0x123',
  },
};

describe('PostItem', () => {
  const originalClipboard = navigator.clipboard;
  const originalShare = navigator.share;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Mock navigator APIs
    Object.defineProperty(navigator, 'clipboard', {
        value: {
            writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
        configurable: true
    });

    Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true
    });
  });

  afterEach(() => {
    // Restore navigator
    if (originalClipboard) {
         Object.defineProperty(navigator, 'clipboard', { value: originalClipboard, writable: true, configurable: true });
    }
    if (originalShare) {
        Object.defineProperty(navigator, 'share', { value: originalShare, writable: true, configurable: true });
    }
  });

  it('renders post content correctly', () => {
    render(<PostItem post={mockPost} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('has a share button with correct label', () => {
    render(<PostItem post={mockPost} />);
    const shareButton = screen.getByLabelText('Share post');
    expect(shareButton).toBeInTheDocument();
  });

  it('calls navigator.share when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: shareMock, writable: true, configurable: true });

    render(<PostItem post={mockPost} />);
    const shareButton = screen.getByLabelText('Share post');

    fireEvent.click(shareButton);

    expect(shareMock).toHaveBeenCalledWith(expect.objectContaining({
      title: expect.stringContaining('Test User'),
      text: expect.stringContaining('Hello World'),
      url: expect.stringContaining('/post/123'),
    }));
  });

  it('falls back to clipboard copy when share is not available', async () => {
    render(<PostItem post={mockPost} />);
    const shareButton = screen.getByLabelText('Share post');

    fireEvent.click(shareButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('/post/123')
    );
  });
});
