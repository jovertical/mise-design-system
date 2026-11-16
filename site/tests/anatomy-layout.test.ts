import { describe, expect, it } from 'vitest'

import {
  layoutMarkers,
  MARKER_GAP,
  MARKER_SIZE,
  relativeBox,
} from '../src/modules/docs/utils/anatomy-layout.js'

const stage = { x: 0, y: 0, width: 600, height: 300 }

describe('relativeBox', () => {
  it('measures a part from the stage corner', () => {
    const part = { x: 150, y: 120, width: 40, height: 20 }
    const frame = { x: 100, y: 100, width: 600, height: 300 }

    expect(relativeBox(part, frame)).toEqual({ x: 50, y: 20, width: 40, height: 20 })
  })
})

describe('layoutMarkers', () => {
  it('puts a part left of centre on the left gutter, right of centre on the right', () => {
    const [left, right] = layoutMarkers(stage, [
      { x: 100, y: 100, width: 80, height: 40 },
      { x: 400, y: 100, width: 80, height: 40 },
    ])

    expect(left.x).toBe(MARKER_GAP)

    expect(left.lineTo).toEqual({ x: 100, y: 120 })

    expect(right.x).toBe(600 - MARKER_GAP - MARKER_SIZE)

    expect(right.lineTo).toEqual({ x: 480, y: 120 })
  })

  it('skips a part that was not found but keeps the others numbered by position', () => {
    const markers = layoutMarkers(stage, [null, { x: 100, y: 100, width: 80, height: 40 }])

    expect(markers.map((marker) => marker.index)).toEqual([1])
  })

  it('pushes markers on one side apart so they never overlap', () => {
    const [first, second] = layoutMarkers(stage, [
      { x: 100, y: 100, width: 80, height: 10 },
      { x: 100, y: 104, width: 80, height: 10 },
    ])

    expect(second.y - first.y).toBeGreaterThanOrEqual(MARKER_SIZE + MARKER_GAP)
  })
})
