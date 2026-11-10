import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import EmptyPanels from './fixtures/empty-panels.svelte'

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`) as HTMLElement

describe('EmptyState', () => {
  it('falls back to wording that is honest anywhere', () => {
    const { container } = render(EmptyPanels, { kind: 'empty' })

    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('There is no data available.')).toBeInTheDocument()
    expect(slot(container, 'empty')).toHaveClass('border', 'border-dashed')
    expect(slot(container, 'empty-icon')).toHaveAttribute('data-variant', 'icon')
  })

  it('takes its own wording and lays actions out in a row', () => {
    const { container } = render(EmptyPanels, {
      kind: 'empty',
      title: 'No locations yet',
      withActions: true,
    })

    expect(screen.getByText('No locations yet')).toBeInTheDocument()
    expect(slot(container, 'empty-content')).toContainElement(screen.getByRole('button'))
  })

  it('renders no actions row without actions', () => {
    const { container } = render(EmptyPanels, { kind: 'empty' })

    expect(slot(container, 'empty-content')).toBeNull()
  })
})

describe('LoadingState', () => {
  it('is the same panel with a solid border and a spinner', () => {
    const { container } = render(EmptyPanels, { kind: 'loading' })

    expect(slot(container, 'empty')).toHaveClass('border-solid')
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.getByText('Loading')).toHaveAttribute('data-slot', 'empty-title')
  })

  it('shows a description only when given one', () => {
    const { container, unmount } = render(EmptyPanels, { kind: 'loading' })

    expect(slot(container, 'empty-description')).toBeNull()

    unmount()

    render(EmptyPanels, { kind: 'loading', description: 'Nothing has been written yet.' })

    expect(screen.getByText('Nothing has been written yet.')).toBeInTheDocument()
  })
})
