import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'
import React from 'react'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(<Button>Default</Button>)
    const button = screen.getByRole('button')
    // Check for some default classes
    expect(button.className).toContain('inline-flex')
    expect(button.className).toContain('bg-gradient-to-r')
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('from-red-500')
  })

  it('applies size classes', () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole('button')
    expect(button.className).toContain('h-8')
  })

  it('shows loading state correctly', () => {
    render(<Button isLoading loadingText="Loading...">Click me</Button>)
    const button = screen.getByRole('button')

    // Check if disabled
    expect(button).toBeDisabled()

    // Check if loading text is shown
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    // Check if original children are hidden
    expect(screen.queryByText('Click me')).not.toBeInTheDocument()

    // Check if spinner is present
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('shows loading state without text correctly', () => {
    render(<Button isLoading>Click me</Button>)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()

    // Check if original children are still shown
    expect(screen.getByText('Click me')).toBeInTheDocument()

    // Check if spinner is present
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('shows loading state for circle button correctly', () => {
    render(
      <Button size="circle" isLoading>
        <span aria-label="Icon">Icon</span>
      </Button>
    )
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()

    // Check if children are hidden for circle button
    expect(screen.queryByLabelText('Icon')).not.toBeInTheDocument()

    // Check if spinner is present
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })
})
