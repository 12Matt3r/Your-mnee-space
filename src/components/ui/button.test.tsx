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

  it('shows loading spinner and text when isLoading is true', () => {
    render(<Button isLoading loadingText="Processing...">Submit</Button>)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(screen.getByText('Processing...')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    expect(screen.queryByText('Submit')).not.toBeInTheDocument()
  })

  it('shows loading spinner and children when isLoading is true but no loadingText', () => {
    render(<Button isLoading>Submit</Button>)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(screen.getByText('Submit')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
  })
})
