import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LoadingSpinner } from './LoadingSpinner'
import React from 'react'

describe('LoadingSpinner', () => {
  it('renders correctly', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.firstChild).toHaveClass('loading-spinner')
  })

  it('applies size classes', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    expect(container.firstChild).toHaveClass('w-12 h-12')
  })

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
