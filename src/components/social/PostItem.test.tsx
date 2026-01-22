import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PostItem from './PostItem';
import { PostWithInteractions } from '../../types/social';

// Mock dependencies
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user' },
  })),
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
  MneeTransactionButton: () => <button>Mock Transaction Button</button>,
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard and share
const mockWriteText = vi.fn();
const mockShare = vi.fn();

Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
  share: mockShare,
});

const mockPost: PostWithInteractions = {
  id: 'post-1',
  user_id: 'user-1',
  content: 'Hello World',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  likes_count: 5,
  replies_count: 2,
  bookmarks_count: 1,
  is_liked: false,
  is_bookmarked: false,
  profiles: {
    user_id: 'user-1',
    full_name: 'Test User',
    username: 'testuser',
    avatar_url: 'https://example.com/avatar.jpg',
  },
};

describe('PostItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls navigator.share when available', async () => {
    // Enable navigator.share
    (navigator as any).share = mockShare;

    render(<PostItem post={mockPost} />);

    const shareButton = screen.getByLabelText('Share post');
    fireEvent.click(shareButton);

    await waitFor(() => expect(mockShare).toHaveBeenCalled());
  });

  it('copies to clipboard when navigator.share is not available', async () => {
    // Disable navigator.share
    (navigator as any).share = undefined;

    render(<PostItem post={mockPost} />);

    const shareButton = screen.getByLabelText('Share post');
    fireEvent.click(shareButton);

    await waitFor(() => expect(mockWriteText).toHaveBeenCalled());
  });
});
