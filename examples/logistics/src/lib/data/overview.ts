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
