import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'
import React from 'react'

// Mock Supabase and API
// We need to define mocks *inside* the vi.mock factory or hoist them manually
// but since we want to control them in tests, we can use a helper or import them from a mock file.
// For simplicity in this environment, we'll define the mock object structure inside vi.mock
// and access the mocked functions via import in the test body (if we were importing the real module).
// But here we are mocking module exports.

const mockGetSession = vi.fn()
const mockOnAuthStateChange = vi.fn()
const mockGetCurrentUserProfile = vi.fn()
const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: (...args) => mockGetSession(...args),
      onAuthStateChange: (...args) => mockOnAuthStateChange(...args),
    },
  },
}))

vi.mock('../lib/api', () => ({
  socialApi: {
    getCurrentUserProfile: (...args) => mockGetCurrentUserProfile(...args),
    signIn: (...args) => mockSignIn(...args),
    signUp: (...args) => mockSignUp(...args),
    signOut: (...args) => mockSignOut(...args),
  },
}))

const TestComponent = () => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return <div>{user ? `Logged in as ${user.email}` : 'Not logged in'}</div>
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockOnAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  })

  it('shows loading initially', () => {
    // Return a promise that doesn't resolve immediately to test loading state
    mockGetSession.mockReturnValue(new Promise(() => {}))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('loads user from session', async () => {
    const mockSession = { user: { id: '123', email: 'test@example.com' } }
    mockGetSession.mockResolvedValue({ data: { session: mockSession } })
    mockGetCurrentUserProfile.mockResolvedValue({ id: '123', username: 'testuser' })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Logged in as test@example.com')).toBeInTheDocument()
    })
  })

  it('handles no session', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } })

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument()
    })
  })
})
