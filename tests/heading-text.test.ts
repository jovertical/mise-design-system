import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Heading, Text } from '../src/lib/index.js'
import { text } from './snippet.js'

describe('Heading', () => {
  it('is an h2 at the md step by default', () => {
    render(Heading, { children: text('Packs and suppliers') })

    const heading = screen.getByRole('heading', { level: 2 })

    expect(heading).toHaveClass('font-heading', 'font-semibold', 'text-lg')
  })

  it('takes its level and its size separately', () => {
    render(Heading, { as: 'h3', size: 'lg', children: text('Suppliers') })

    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('text-xl')
  })
})

describe('Text', () => {
  it('is an unstyled span by default, inheriting the line', () => {
    const { container } = render(Text, { children: text('2 minutes ago') })
    const element = container.querySelector('[data-slot="text"]') as HTMLElement

    expect(element.tagName).toBe('SPAN')
    expect(element.className).toBe('')
  })

  it('maps size, muting, weight, figures and truncation to their classes', () => {
    const { container } = render(Text, {
      as: 'p',
      size: 'xs',
      muted: true,
      weight: 'medium',
      numeric: true,
      truncate: true,
      children: text('Updated 16 Jul'),
    })

    const element = container.querySelector('p') as HTMLElement

    expect(element).toHaveClass(
      'text-xs',
      'text-muted-foreground',
      'font-medium',
      'tabular-nums',
      'truncate',
    )
  })

  it('lets a tone win over muted', () => {
    const { container } = render(Text, {
      muted: true,
      tone: 'critical',
      children: text('Required'),
    })

    const element = container.querySelector('[data-slot="text"]') as HTMLElement

    expect(element).toHaveClass('text-destructive')
    expect(element).not.toHaveClass('text-muted-foreground')
  })
})
