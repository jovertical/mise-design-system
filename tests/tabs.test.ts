import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ShiftTabs from './fixtures/shift-tabs.svelte'

const tab = (name: string) => screen.getByRole('tab', { name })

describe('Tabs', () => {
  it('draws the list as the segmented track and the active trigger as its pill', () => {
    render(ShiftTabs)
    expect(screen.getByRole('tablist')).toHaveClass('rounded-full', 'bg-black/5')
    expect(tab('Register schedule')).toHaveAttribute('data-state', 'active')
    expect(tab('Register schedule')).toHaveClass('data-[state=active]:bg-background')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Two registers open')
  })

  it('switches panels on click and binds the value back', async () => {
    render(ShiftTabs)
    await userEvent.click(tab('Recent activity'))
    expect(tab('Recent activity')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Nothing has moved')
    expect(screen.getByTestId('value')).toHaveTextContent('activity')
  })

  it('does not activate a disabled trigger', async () => {
    render(ShiftTabs)
    await userEvent.click(tab('Archive'))
    expect(screen.getByTestId('value')).toHaveTextContent('schedule')
  })

  it('moves between triggers with the arrow keys', async () => {
    render(ShiftTabs)
    tab('Register schedule').focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(tab('Recent activity')).toHaveFocus()
  })
})
