import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import SearchGroup from './fixtures/search-group.svelte'

describe('InputGroup', () => {
  it('draws the group on the Input surface, with the control inside it', () => {
    const { container } = render(SearchGroup)
    const group = container.querySelector('[data-slot="input-group"]') as HTMLElement
    expect(group).toHaveClass('bg-input/50', 'rounded-2xl')
    expect(group).toContainElement(screen.getByRole('textbox', { name: 'Search stock' }))
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input-group-control')
  })

  it('focuses the input when an addon is clicked', async () => {
    render(SearchGroup)
    await userEvent.click(screen.getByText('Find'))
    expect(screen.getByRole('textbox')).toHaveFocus()
  })

  it('renders an addon button as a ghost Button that acts on its own click', async () => {
    render(SearchGroup)
    const clear = screen.getByRole('button', { name: 'Clear' })
    expect(clear).toHaveAttribute('data-slot', 'input-group-button')
    expect(clear).toHaveAttribute('type', 'button')
    expect(clear).toHaveClass('size-6')
    await userEvent.click(clear)
    expect(screen.getByTestId('value').textContent).toBe('')
  })
})
