import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginPage } from './LoginPage'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'

// Mock useAuth
const mockSignIn = vi.fn()
const mockDemoLogin = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

// Mock ParticleBackground
vi.mock('../../components/effects/ParticleBackground', () => ({
  ParticleBackground: () => <div data-testid="particle-background" />
}))

// Mock DiscordLogin
vi.mock('../../components/auth/DiscordLogin', () => ({
  DiscordLogin: () => <button>Discord Login</button>
}))

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({
      user: null,
      signIn: mockSignIn,
      loading: false,
      demoLogin: mockDemoLogin
    })
  })

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/enter demo mode/i)).toBeInTheDocument()
  })

  it('handles sign in submission', async () => {
    mockSignIn.mockResolvedValue({})
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'password123' } })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('handles demo login click', async () => {
     mockDemoLogin.mockResolvedValue({})
     render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const demoBtn = screen.getByRole('button', { name: /enter demo mode/i })
    fireEvent.click(demoBtn)

    await waitFor(() => {
        expect(mockDemoLogin).toHaveBeenCalled()
    })
  })

  it('should have independent loading states', async () => {
    // Simulate a long running demo login
    let resolveDemo: (value: unknown) => void = () => {}
    const demoPromise = new Promise(r => { resolveDemo = r })
    mockDemoLogin.mockReturnValue(demoPromise)

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    )

    const signInBtn = screen.getByRole('button', { name: /sign in/i })
    const demoBtn = screen.getByRole('button', { name: /enter demo mode/i })

    // Click demo login
    fireEvent.click(demoBtn)

    // Wait for state update - we expect this to fail currently if we assert strict correctness
    // But since I am fixing it, I will write the assertion for the Desired State.

    // In the FIXED version:
    // Demo button should show "Entering Demo..." (or similar loading state)
    // Sign In button should NOT show "Signing In..."

    await waitFor(() => {
      expect(demoBtn).toBeDisabled()
      expect(signInBtn).toBeDisabled() // Both should be disabled during loading
    })

    // Current bug: SignIn button shows "Signing In..." because isLoading is shared
    // Desired: SignIn button shows "Sign In"
    expect(signInBtn).toHaveTextContent('Sign In')
    expect(signInBtn).not.toHaveTextContent('Signing In...')

    // Desired: Demo button shows loading text
    // Current: Demo button shows "Enter Demo Mode"
    expect(demoBtn).toHaveTextContent(/entering demo/i)

    resolveDemo({})
  })
})
