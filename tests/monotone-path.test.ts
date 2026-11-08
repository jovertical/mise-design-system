import { describe, expect, it } from 'vitest'

import { monotonePath } from '../src/lib/utils/monotone-path.js'

/** Every number in a path, in order. */
const numbers = (path: string) => (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)

describe('monotonePath', () => {
  it('draws nothing for fewer than two points, and a line for two', () => {
    expect(monotonePath([])).toBe('')
    expect(monotonePath([[0, 5]])).toBe('')
    expect(
      monotonePath([
        [0, 0],
        [10, 10],
      ]),
    ).toBe('M0,0L10,10')
  })

  it('keeps collinear points on their line', () => {
    const path = monotonePath([
      [0, 0],
      [10, 10],
      [20, 20],
    ])
    expect(path.startsWith('M0,0C')).toBe(true)
    const values = numbers(path)
    for (let index = 0; index < values.length; index += 2) {
      expect(values[index]).toBeCloseTo(values[index + 1], 6)
    }
  })

  it('never overshoots a peak: the curve stays within each segment', () => {
    const points: [number, number][] = [
      [0, 0],
      [10, 8],
      [20, 10],
      [30, 2],
      [40, 9],
    ]
    const path = monotonePath(points)
    const segments = path.slice(path.indexOf('C') + 1).split('C')
    expect(segments).toHaveLength(points.length - 1)
    segments.forEach((segment, index) => {
      const [, c1y, , c2y] = numbers(segment)
      const low = Math.min(points[index][1], points[index + 1][1])
      const high = Math.max(points[index][1], points[index + 1][1])
      expect(c1y).toBeGreaterThanOrEqual(low - 1e-9)
      expect(c1y).toBeLessThanOrEqual(high + 1e-9)
      expect(c2y).toBeGreaterThanOrEqual(low - 1e-9)
      expect(c2y).toBeLessThanOrEqual(high + 1e-9)
    })
  })

  it('flattens at a local extremum', () => {
    const path = monotonePath([
      [0, 0],
      [10, 10],
      [20, 0],
    ])
    const [first, second] = path.slice(path.indexOf('C') + 1).split('C')
    expect(numbers(first)[3]).toBeCloseTo(10)
    expect(numbers(second)[1]).toBeCloseTo(10)
  })
})
