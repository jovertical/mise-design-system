import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { ChoiceRowReadonly } from '../src/lib/index.js'
import ChoiceRowHarness from './fixtures/choice-row-harness.svelte'

const root = () => document.querySelector('[data-slot="choice-row"]') as HTMLElement

describe('ChoiceRow', () => {
  it('names its control by the label and toggles once from a click anywhere on the row', async () => {
    render(ChoiceRowHarness)

    const box = screen.getByRole('checkbox', { name: /Bakery/ })

    await userEvent.click(screen.getByText('Bread, pastry, counter service.'))

    expect(box).toHaveAttribute('aria-checked', 'true')

    await userEvent.click(screen.getByText('Bakery'))

    expect(box).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByTestId('checked')).toHaveTextContent('off')
  })

  it('takes pointer events off the control so a click arrives once', () => {
    render(ChoiceRowHarness)

    expect(screen.getByRole('checkbox').parentElement).toHaveClass('pointer-events-none', 'mt-0.5')
  })

  it('highlights from the control’s data-state', () => {
    render(ChoiceRowHarness)

    expect(root()).toHaveClass('has-[[data-state=checked]]:border-primary', 'rounded-2xl')
  })

  it('moves the control to the trailing edge when there is media', () => {
    render(ChoiceRowHarness, { withMedia: true })

    const label = root().querySelector('label') as HTMLLabelElement
    const spans = [...label.children]

    expect(spans[0]).toHaveTextContent('BK')
    expect(spans.at(-1)?.querySelector('[role="checkbox"]')).not.toBeNull()
    expect(spans.at(-1)).toHaveClass('self-center')
  })

  it('dims, badges and disables', async () => {
    render(ChoiceRowHarness, { disabled: true })

    expect(root()).toHaveClass('opacity-60')
    expect(root().querySelector('label')).toHaveClass('cursor-not-allowed')
    expect(screen.getByText('Coming soon')).toHaveAttribute('data-slot', 'badge')
    expect(screen.getByText('Coming soon')).toHaveClass('bg-foreground/[0.07]')

    await userEvent.click(screen.getByText('Bakery'))

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('reveals its children outside the label', async () => {
    render(ChoiceRowHarness, { withChildren: true })

    const field = screen.getByRole('textbox', { name: 'Opening hours' })

    expect(field.closest('label')).toBeNull()

    await userEvent.click(field)

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })
})

describe('ChoiceRowReadonly', () => {
  it('draws a filled dot when selected and dims when not', () => {
    const { container, rerender } = render(ChoiceRowReadonly, { label: 'Visible', selected: true })
    const row = container.querySelector('[data-slot="choice-row-readonly"]') as HTMLElement

    expect(row).toHaveClass('border-primary', 'bg-primary/5')
    expect(row.querySelector('.bg-primary.size-2')).not.toBeNull()

    rerender({ label: 'Visible', selected: false })

    expect(row).toHaveClass('opacity-60')
    expect(row.querySelector('.bg-primary.size-2')).toBeNull()
  })
})
