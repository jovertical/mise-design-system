import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { Sparkline } from '../src/lib/index.js'

describe('Sparkline', () => {
  it('is an image named for assistive tech, at the height asked for', () => {
    render(Sparkline, { data: [1, 3, 2, 5], 'aria-label': 'Sales, climbing', height: 32 })

    const image = screen.getByRole('img', { name: 'Sales, climbing' })

    expect(image).toHaveAttribute('data-slot', 'sparkline')
    expect(image.style.height).toBe('32px')
  })

  it('strokes the line in its tone, and fills under it with its own gradient', () => {
    const { container } = render(Sparkline, { data: [1, 3, 2, 5], tone: 'success' })
    const [area, line] = container.querySelectorAll('path')

    expect(line).toHaveAttribute('stroke', 'var(--color-success)')
    expect(line.getAttribute('d')).toMatch(/^M[\d.,-]+C/)

    const gradient = container.querySelector('linearGradient') as SVGElement

    expect(area).toHaveAttribute('fill', `url(#${gradient.id})`)
  })

  it('gives each sparkline its own gradient id', () => {
    const first = render(Sparkline, { data: [1, 2] }).container
    const second = render(Sparkline, { data: [2, 1] }).container
    const id = (container: HTMLElement) => container.querySelector('linearGradient')?.id

    expect(id(first)).not.toBe(id(second))
  })

  it('draws nothing for fewer than two points', () => {
    const { container } = render(Sparkline, { data: [42] })

    expect(container.querySelector('[data-slot="sparkline"]')).toBeNull()
  })
})
