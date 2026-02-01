import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import React from 'react'

// Mock useAuth
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

// Mock web3 components to avoid complex dependencies
vi.mock('../web3/ConnectWallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>
}))

vi.mock('../mnee/BuyMNEEButton', () => ({
  BuyMNEEButton: () => <div data-testid="buy-mnee">Buy MNEE</div>
}))

vi.mock('../theme/ThemeSelector', () => ({
  ThemeSelector: () => <div data-testid="theme-selector">Theme</div>
}))

describe('Header', () => {
  it('renders correctly for guest user', () => {
    // Mock return value for guest
    (useAuth as any).mockReturnValue({
      user: null,
      profile: null,
      signOut: vi.fn()
    })

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Check for Logo Link with new ARIA label
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')

    // Check for Search
    expect(screen.getByLabelText(/search content/i)).toBeInTheDocument()

    // Check for Sign In / Sign Up
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
  })

  it('renders correctly for authenticated user', () => {
    // Mock return value for auth user
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      profile: { display_name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' },
      signOut: vi.fn()
    })

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )

    // Check for Logo Link
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()

    // Check for Create button
    expect(screen.getByRole('link', { name: /create new content/i })).toBeInTheDocument()

    // Check for Notifications
    expect(screen.getByRole('button', { name: /view notifications/i })).toBeInTheDocument()

    // Check for User Menu with new ARIA label
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument()
  })
})
