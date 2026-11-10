/**
 * The overview repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import {
  change,
  deliveredThisWeek,
  deliveryTrend,
  ordersToday,
  pipeline,
  pipelineUrgency,
} from '../src/modules/overview/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('overview', () => {
  it('counts the pipeline as packed, shipped and delivered', () => {
    expect(pipeline(source)).toEqual({
      packed: { count: 14, share: 27 },
      shipped: { count: 18, share: 35 },
      delivered: { count: 20, share: 38 },
    })
  })

  it('counts the express and same-day orders in each stage', () => {
    const urgency = pipelineUrgency(source)
    const ready = source.data.orders.filter((order) => order.status === 'ready')

    expect(urgency.packed.count).toBe(ready.filter((order) => order.service !== 'regular').length)
    expect(urgency.packed.share).toBeGreaterThan(0)
    expect(urgency.packed.share).toBeLessThanOrEqual(100)
  })

  it('measures change between two counts', () => {
    expect(change(12, 10)).toBe(20)
    expect(change(9, 12)).toBe(-25)
    expect(change(5, 0)).toBe(0)
  })

  it('compares today with yesterday, and this week with the last', () => {
    const today = ordersToday(source)

    expect(today.count).toBe(source.data.orders.filter((order) => order.placedAt.day === 0).length)
    expect(Math.abs(today.change)).toBeLessThan(200)
    expect(typeof deliveredThisWeek(source).change).toBe('number')

    expect(deliveredThisWeek(source).count).toBe(
      deliveryTrend(source).reduce((sum, day) => sum + day.delivered, 0),
    )
  })

  it('charts the last seven days', () => {
    const trend = deliveryTrend(source)

    expect(trend).toHaveLength(7)
    expect(trend.at(-1)?.day).toBe('14 Jul')
    expect(trend.reduce((sum, point) => sum + point.placed, 0)).toBeGreaterThan(0)
  })
})
