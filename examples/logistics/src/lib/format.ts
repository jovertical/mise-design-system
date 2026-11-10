/**
 * Display formatting, at the edge only: the data keeps cents, kilograms and
 * day offsets. Every date in the demo is relative to DEMO_TODAY, so the demo
 * never looks stale and screenshots never drift.
 */
import type { Cents, DemoTime } from './data/types.js'

export const DEMO_TODAY = '2026-07-14'

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

const compact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const numbers = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })

export const money = (cents: Cents) => dollars.format(cents / 100)

export const compactMoney = (cents: Cents) => compact.format(cents / 100)

export function dateOf({ day: offset, time }: DemoTime): Date {
  const date = new Date(`${DEMO_TODAY}T${time}:00.000Z`)

  date.setUTCDate(date.getUTCDate() + offset)

  return date
}

export const shortDate = (time: DemoTime) => day.format(dateOf(time))

export const dateTime = (time: DemoTime) => `${shortDate(time)} · ${time.time}`

export const weight = (kg: number) => `${numbers.format(kg)} kg`
