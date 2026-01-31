import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PageLoader } from './PageLoader'
import React from 'react'

describe('PageLoader', () => {
  it('renders correctly', () => {
    const { container } = render(<PageLoader />)
    // It should render a div with centering classes
    expect(container.firstChild).toHaveClass('flex items-center justify-center min-h-[50vh] w-full')
    // It should contain the loading spinner
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument()
  })
})
