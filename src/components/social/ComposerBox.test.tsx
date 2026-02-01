import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ComposerBox from './ComposerBox'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

// Mock useAuth
const mockUser = { id: '1', email: 'test@example.com' }
const mockProfile = { full_name: 'Test User', avatar_url: 'test.jpg' }

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    profile: mockProfile,
  }),
}))

// Mock socialApi
vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: vi.fn(),
  },
}))

describe('ComposerBox', () => {
  it('renders textarea and button', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    )

    expect(screen.getByPlaceholderText("What's happening in your creative world?")).toBeInTheDocument()
    // Using explicit regex for strict matching if needed, but case insensitive 'post' should catch 'Post'
    expect(screen.getByRole('button', { name: /^post$/i })).toBeInTheDocument()
  })

  it('updates text value on change', () => {
    render(
      <BrowserRouter>
        <ComposerBox />
      </BrowserRouter>
    )

    const textarea = screen.getByPlaceholderText("What's happening in your creative world?")
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    expect(textarea).toHaveValue('Hello world')
  })
})
