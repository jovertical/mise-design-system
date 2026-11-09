import { describe, expect, it } from 'vitest'

import { compactMoney, dateOf, dateTime, money, shortDate, weight } from '../src/lib/format.js'

describe('format', () => {
  it('formats cents as dollars', () => {
    expect(money(123450)).toBe('$1,234.50')
    expect(money(0)).toBe('$0.00')
    expect(money(-2210)).toBe('-$22.10')
  })

  it('abbreviates large amounts', () => {
    expect(compactMoney(4561240)).toBe('$45.6K')
    expect(compactMoney(31800)).toBe('$318')
  })

  it('places a demo time relative to DEMO_TODAY', () => {
    expect(dateOf({ day: 0, time: '09:30' }).toISOString()).toBe('2026-07-14T09:30:00.000Z')
    expect(shortDate({ day: -2, time: '08:00' })).toBe('12 Jul')
    expect(shortDate({ day: -31, time: '08:00' })).toBe('13 Jun')
    expect(dateTime({ day: 1, time: '17:05' })).toBe('15 Jul · 17:05')
  })

  it('formats weights', () => {
    expect(weight(1990)).toBe('1,990 kg')
    expect(weight(12.5)).toBe('12.5 kg')
  })
})
