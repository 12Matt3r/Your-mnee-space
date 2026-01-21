import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileBuilderHeader } from './ProfileBuilderHeader'
import { vi } from 'vitest'
import { ProfileLayout } from '../../hooks/useProfileBuilder'
import React from 'react'

const mockLayout: ProfileLayout = {
  id: '1',
  name: 'Default Layout',
  isActive: true,
  widgets: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('ProfileBuilderHeader', () => {
  const defaultProps = {
    layouts: [mockLayout],
    activeLayout: mockLayout,
    onCreateLayout: vi.fn(),
    onActivateLayout: vi.fn(),
    onDeleteLayout: vi.fn(),
    onSave: vi.fn(),
    onPreview: vi.fn(),
    onToggleLibrary: vi.fn(),
  }

  it('renders accessibility labels for icon-only buttons', () => {
    const layoutsWithMultiple = [
      mockLayout,
      { ...mockLayout, id: '2', name: 'Layout 2', isActive: false }
    ]

    render(
      <ProfileBuilderHeader
        {...defaultProps}
        layouts={layoutsWithMultiple}
      />
    )

    // 1. Toggle Widget Library
    // Expect aria-label to be present (getByLabelText uses aria-label)
    expect(screen.getByLabelText(/toggle widget library/i)).toBeInTheDocument()

    // 2. Layout Selector
    const layoutSelector = screen.getByText('Default Layout').closest('button')
    expect(layoutSelector).toHaveAttribute('aria-haspopup', 'true')
    expect(layoutSelector).toHaveAttribute('aria-expanded', 'false')

    // Open the menu to check Delete button
    if (layoutSelector) {
      fireEvent.click(layoutSelector)
    }
    expect(layoutSelector).toHaveAttribute('aria-expanded', 'true')

    // 3. Delete Layout
    // Should be findable by aria-label
    // Note: The icon is duplicated because there are 2 layouts and both have delete buttons (except maybe active one logic? No, logic is layouts.length > 1)
    // Actually, logic is:
    /*
        {layouts.map((layout) => (
            ...
            {layouts.length > 1 && (
                <button ... title="Delete Layout">
    */
    // So both layouts will have a delete button. getAllByLabelText should find them.
    const deleteButtons = screen.getAllByLabelText(/delete layout/i)
    expect(deleteButtons.length).toBeGreaterThan(0)

    // 4. More Options button
    // This currently has NO accessible name.
    expect(screen.getByLabelText(/more options/i)).toBeInTheDocument()
  })
})
