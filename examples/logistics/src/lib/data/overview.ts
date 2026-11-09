/** The figures only the overview shows. */
import { shortDate } from '../format.js'
import { percent, type Source } from './shared.js'

export function pipeline(s: Source) {
  const count = (status: string) => s.data.orders.filter((order) => order.status === status).length
  const packed = count('ready')
  const shipped = count('in-fulfilment')
  const delivered = count('completed')
  const total = packed + shipped + delivered
  return {
    packed: { count: packed, share: percent(packed, total) },
    shipped: { count: shipped, share: percent(shipped, total) },
    delivered: { count: delivered, share: percent(delivered, total) },
  }
}

const STAGE_STATUS = { packed: 'ready', shipped: 'in-fulfilment', delivered: 'completed' } as const

/** Per pipeline stage: how many of its orders are express or same day, and their share. */
export function pipelineUrgency(s: Source) {
  return Object.fromEntries(
    Object.entries(STAGE_STATUS).map(([stage, status]) => {
      const orders = s.data.orders.filter((order) => order.status === status)
      const urgent = orders.filter((order) => order.service !== 'regular').length
      return [stage, { count: urgent, share: percent(urgent, orders.length) }]
    }),
  ) as Record<keyof typeof STAGE_STATUS, { count: number; share: number }>
}

/** Orders delivered and placed on each of the last seven days, oldest first. */
export function deliveryTrend(s: Source) {
  return Array.from({ length: 7 }, (_, index) => {
    const day = index - 6
    const delivered = s.data.orders.filter((order) =>
      order.events.some((event) => event.status === 'completed' && event.at.day === day),
    ).length
    const placed = s.data.orders.filter((order) => order.placedAt.day === day).length
    return { day: shortDate({ day, time: '12:00' }), delivered, placed }
  })
}

/** Change from `before` to `now` in percent, one decimal; 0 when there was nothing before. */
export const change = (now: number, before: number) =>
  before ? Math.round(((now - before) / before) * 1000) / 10 : 0

const placedOn = (s: Source, day: number) =>
  s.data.orders.filter((order) => order.placedAt.day === day).length

const deliveredBetween = (s: Source, from: number, to: number) =>
  s.data.orders.filter((order) =>
    order.events.some(
      (event) => event.status === 'completed' && event.at.day >= from && event.at.day <= to,
    ),
  ).length

/**
 * Orders placed today, and the change from the daily average of the six days
 * before: one quiet yesterday would otherwise turn a normal day into +500%.
 */
export function ordersToday(s: Source) {
  const today = placedOn(s, 0)
  const before = Array.from({ length: 6 }, (_, index) => placedOn(s, index - 6))
  const average = before.reduce((sum, count) => sum + count, 0) / before.length
  return { count: today, change: change(today, average) }
}

/** Orders delivered over the last seven days, and the change from the seven before. */
export function deliveredThisWeek(s: Source) {
  const week = deliveredBetween(s, -6, 0)
  return { count: week, change: change(week, deliveredBetween(s, -13, -7)) }
}
