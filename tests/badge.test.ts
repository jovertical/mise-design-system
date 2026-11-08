import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Badge } from '../src/lib/index.js'
import { text } from './snippet.js'

const badge = (container: HTMLElement) =>
  container.querySelector('[data-slot="badge"]') as HTMLElement

describe('Badge', () => {
  it('defaults to a soft neutral span in the regular weight', () => {
    const el = badge(render(Badge, { children: text('Draft') }).container)
    expect(el.tagName).toBe('SPAN')
    expect(el).toHaveAttribute('data-variant', 'soft')
    expect(el).toHaveAttribute('data-tone', 'neutral')
    expect(el).toHaveClass('bg-foreground/[0.07]', 'text-muted-foreground', 'font-normal')
  })

  it('sets a toned badge in the medium weight', () => {
    const el = badge(render(Badge, { tone: 'success', children: text('Open') }).container)
    expect(el).toHaveClass('bg-success-soft', 'text-success', 'font-medium')
  })

  it('draws solid and outline treatments from the tone maps', () => {
    const solid = render(Badge, { variant: 'solid', tone: 'critical', children: text('Late') })
    expect(badge(solid.container)).toHaveClass('bg-destructive', 'text-destructive-foreground')
    const outline = render(Badge, { variant: 'outline', tone: 'info', children: text('Tag') })
    expect(badge(outline.container)).toHaveClass('border-info/50', 'bg-transparent')
  })

  it('shapes a count as a circle of fixed height', () => {
    const el = badge(render(Badge, { count: true, children: text('3') }).container)
    expect(el).toHaveAttribute('data-count', 'true')
    expect(el).toHaveClass('h-5', 'min-w-5', 'rounded-full', 'tabular-nums')
  })

  it('renders a link when given an href', () => {
    render(Badge, { href: '/orders?status=late', children: text('Late') })
    expect(screen.getByRole('link', { name: 'Late' })).toHaveAttribute(
      'href',
      '/orders?status=late',
    )
  })
})
