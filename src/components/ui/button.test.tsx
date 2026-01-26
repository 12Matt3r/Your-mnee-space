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
    render(<Button isLoading>Submit</Button>)
    const button = screen.getByRole('button')

    // Should be disabled
    expect(button).toBeDisabled()

    // Should show spinner (check for a generic way if possible, or assumption of implementation)
    // Since we use lucide-react Loader2, it usually renders an svg.
    // We can check if the button contains an element with animate-spin class
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()

    // Should still show text by default
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('shows loading text when provided', () => {
    render(<Button isLoading loadingText="Saving...">Submit</Button>)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.queryByText('Submit')).not.toBeInTheDocument()
  })

  it('replaces content with spinner for circle buttons', () => {
    render(
      <Button size="circle" isLoading>
        <span data-testid="icon">Icon</span>
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })
})
