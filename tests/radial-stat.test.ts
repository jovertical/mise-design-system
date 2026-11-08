import { render, screen } from '@testing-library/svelte'
import { describe, expect, it } from 'vitest'

import { RadialStat } from '../src/lib/index.js'

const circles = (container: HTMLElement) => container.querySelectorAll('circle')

describe('RadialStat', () => {
  it('is an image named for its share, with the percentage printed inside', () => {
    render(RadialStat, { percent: 40 })
    expect(screen.getByRole('img', { name: '40 percent' })).toHaveAttribute(
      'data-slot',
      'radial-stat',
    )
    expect(screen.getByText('40%')).toHaveClass('tabular-nums')
  })

  it('derives the stroke from the diameter: a twelfth regular, a sixth thick, 4px at least', () => {
    const regular = render(RadialStat, { percent: 40, diameter: 120 }).container
    expect(circles(regular)[0]).toHaveAttribute('stroke-width', '10')
    const thick = render(RadialStat, { percent: 40, diameter: 120, thickness: 'thick' }).container
    expect(circles(thick)[0]).toHaveAttribute('stroke-width', '20')
    const small = render(RadialStat, { percent: 40, diameter: 36 }).container
    expect(circles(small)[0]).toHaveAttribute('stroke-width', '4')
  })

  it('draws the arc as a share of the circumference, in its tone', () => {
    const { container } = render(RadialStat, { percent: 25, diameter: 72, tone: 'success' })
    const arc = circles(container)[1]
    const circumference = 2 * Math.PI * ((72 - 6) / 2)
    expect(Number(arc.getAttribute('stroke-dasharray'))).toBeCloseTo(circumference)
    expect(Number(arc.getAttribute('stroke-dashoffset'))).toBeCloseTo(circumference * 0.75)
    expect(arc).toHaveClass('stroke-success')
  })

  it('clamps to 0–100 and squares the cap off an arc shorter than the stroke', () => {
    const over = render(RadialStat, { percent: 140 }).container
    expect(Number(circles(over)[1].getAttribute('stroke-dashoffset'))).toBeCloseTo(0)
    expect(circles(over)[1]).toHaveAttribute('stroke-linecap', 'round')
    const sliver = render(RadialStat, { percent: 1, diameter: 140 }).container
    expect(circles(sliver)[1]).toHaveAttribute('stroke-linecap', 'butt')
  })
})
