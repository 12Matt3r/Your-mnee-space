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

  it('shows loading state', () => {
    render(<Button isLoading>Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Click me')).toBeInTheDocument()
    // Check for spinner class which is applied to the Loader2 component
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('shows loading text', () => {
    render(<Button isLoading loadingText="Saving...">Click me</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.queryByText('Click me')).not.toBeInTheDocument()
  })
})
