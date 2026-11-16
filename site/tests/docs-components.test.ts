import { render, screen } from '@testing-library/svelte'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ApiTable from '../src/modules/docs/components/api-table.svelte'
import Preview from '../src/modules/docs/components/preview.svelte'
import ExampleBasic from './fixtures/example-basic.svelte'

const example = {
  component: ExampleBasic,
  source: '<Button>Open shift</Button>',
  html: '<pre class="shiki"><code>&lt;Button&gt;Open shift&lt;/Button&gt;</code></pre>',
}

describe('Preview', () => {
  it('shows the example live, and its source on the Code tab', async () => {
    render(Preview, { example })

    expect(screen.getByRole('button', { name: 'Open shift' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('tab', { name: 'Code' }))

    expect(screen.getByText('<Button>Open shift</Button>')).toBeInTheDocument()
  })
})

describe('ApiTable', () => {
  it('renders every part of a component, each under its anchor', () => {
    const { container } = render(ApiTable, { component: 'Dialog' })

    expect(container.querySelector('#api-dialog-content')).not.toBeNull()

    expect(screen.getAllByText('showCloseButton').length).toBeGreaterThan(0)
  })

  it('renders one part when asked for a part', () => {
    const { container } = render(ApiTable, { part: 'DialogContent' })

    expect(container.querySelectorAll('[data-api-part]')).toHaveLength(1)
  })
})
