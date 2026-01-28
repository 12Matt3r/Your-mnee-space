import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ComposerBox from './ComposerBox'
import React from 'react'

// Mock dependencies
const mockUseAuth = vi.fn()
const mockCreatePost = vi.fn()

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}))

vi.mock('../../lib/api', () => ({
  socialApi: {
    createPost: (...args) => mockCreatePost(...args)
  }
}))

// Mock React Router Link
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>
}))

describe('ComposerBox', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sign in prompt when not logged in', () => {
    mockUseAuth.mockReturnValue({ user: null })
    render(<ComposerBox />)
    expect(screen.getByText(/Sign in to share your creative thoughts/i)).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('renders composer when logged in', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      profile: { full_name: 'Test User', avatar_url: 'http://example.com/avatar.jpg' }
    })
    render(<ComposerBox />)
    expect(screen.getByPlaceholderText(/What's happening in your creative world?/i)).toBeInTheDocument()
  })

  it('updates text input and character count', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      profile: { full_name: 'Test User' }
    })
    render(<ComposerBox />)
    const textarea = screen.getByPlaceholderText(/What's happening in your creative world?/i)

    // Type some text
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    expect(textarea).toHaveValue('Hello world')

    // Character count should NOT be visible (280 - 11 = 269 > 20)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    // Type a lot of text to make it visible
    const longText = 'a'.repeat(261) // 280 - 261 = 19 remaining
    fireEvent.change(textarea, { target: { value: longText } })

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('19')
  })

  it('applies focus-visible styles to textarea', () => {
     mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      profile: { full_name: 'Test User' }
    })
    render(<ComposerBox />)
    const textarea = screen.getByPlaceholderText(/What's happening in your creative world?/i)

    expect(textarea.className).toContain('focus-visible:ring-2')
    expect(textarea.className).toContain('focus-visible:ring-blue-500')
  })
})
