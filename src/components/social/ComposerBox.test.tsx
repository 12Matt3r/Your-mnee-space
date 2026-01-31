import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ComposerBox from './ComposerBox';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Hoist mocks
const mocks = vi.hoisted(() => ({
  createPost: vi.fn(),
  useAuth: vi.fn(),
}));

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: mocks.createPost,
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: mocks.useAuth,
}));

const mockUser = { id: 'test-user', email: 'test@example.com' };
const mockProfile = { full_name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' };

describe('ComposerBox', () => {
  it('renders correctly for logged-in user', () => {
    mocks.useAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("What's happening in your creative world?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Post' })).toBeDisabled(); // Initially disabled
  });

  it('renders login prompt for logged-out user', () => {
    mocks.useAuth.mockReturnValue({
      user: null,
      profile: null,
    });

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    expect(screen.getByText('Sign in to share your creative thoughts')).toBeInTheDocument();
  });

  it('enables post button when text is entered', () => {
    mocks.useAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    expect(screen.getByRole('button', { name: 'Post' })).not.toBeDisabled();
  });

  it('calls createPost when form is submitted', async () => {
    mocks.useAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    const postButton = screen.getByRole('button', { name: 'Post' });
    fireEvent.click(postButton);

    await waitFor(() => {
        expect(mocks.createPost).toHaveBeenCalledWith('Hello world');
    });
  });

  it('shows loading spinner when posting', async () => {
     mocks.useAuth.mockReturnValue({
      user: mockUser,
      profile: mockProfile,
    });

    mocks.createPost.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    );

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?");
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    const postButton = screen.getByRole('button', { name: 'Post' });
    fireEvent.click(postButton);

    // Check for loading spinner by role and label
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument();
  });
});
