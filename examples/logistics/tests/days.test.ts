import { describe, expect, it } from 'vitest'

import { dateToDay, dayToDate } from '../src/modules/core/data/days.js'

describe('day offsets and calendar dates', () => {
  it('puts day 0 on the demo date', () => {
    expect(dayToDate(0).toString()).toBe('2026-07-14')
    expect(dayToDate(40).toString()).toBe('2026-08-23')
    expect(dayToDate(-4).toString()).toBe('2026-07-10')
  })

  it('goes back to the same offset', () => {
    for (const offset of [-120, -3, 0, 1, 150]) expect(dateToDay(dayToDate(offset))).toBe(offset)
  })
})
