/**
 * The orders repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import {
  cancelOrder,
  createOrder,
  getOrder,
  isOrderEditable,
  listOrders,
  orderStats,
  ordersByStatus,
  orderToInput,
  updateOrder,
} from '../src/modules/orders/data/index.js'
import { orderSchema } from '../src/modules/orders/data/schema.js'
import type { Order } from '../src/modules/orders/data/types.js'

let source: Store

/** A seed order that must exist; fails the test with its number if not. */
function seedOrder(number: string): Order {
  const order = getOrder(source, number)

  if (!order) throw new Error(`The seed has no ${number}`)

  return order
}

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('orders', () => {
  it('counts each open status with a seven-day trend', () => {
    const stats = orderStats(source)

    expect(stats.received.count).toBe(6)
    expect(stats.ready.count).toBe(14)
    expect(stats['in-fulfilment'].count).toBe(18)
    expect(stats.completed.count).toBe(20)
    expect(stats.ready.trend).toHaveLength(7)
  })

  it('lists newest first, searching number and client name', () => {
    expect(listOrders(source)[0].number).toBe('OR-2060')

    expect(listOrders(source, { search: 'or-2041' }).map((order) => order.number)).toEqual([
      'OR-2041',
    ])

    expect(listOrders(source, { search: 'BLOOM' }).length).toBeGreaterThan(1)
    expect(listOrders(source, { status: 'received' })).toHaveLength(6)
  })

  it('finds an order by id or number', () => {
    expect(getOrder(source, 'OR-2041')?.status).toBe('ready')
    expect(getOrder(source, 'or-2041')?.number).toBe('OR-2041')
    expect(getOrder(source, 'does-not-exist')).toBeUndefined()
  })

  it('groups orders by status for the board', () => {
    expect(ordersByStatus(source).ready).toHaveLength(14)
    expect(ordersByStatus(source).cancelled).toHaveLength(2)
  })

  it('creates an order with the next number, received today', () => {
    const order = createOrder(source, {
      clientId: source.data.clients[0].id,
      service: 'express',
      originId: 'loc-riverside',
      destination: '12 Dock Rd',
      packages: [
        { contents: 'Crates', weightKg: 40 },
        { contents: 'Pallet wrap', weightKg: 12 },
      ],
      total: 5600,
    })

    expect(order).toMatchObject({ number: 'OR-2061', status: 'received', shipmentId: null })

    expect(order.packages).toEqual([
      { label: 'PKG-1', contents: 'Crates', weightKg: 40 },
      { label: 'PKG-2', contents: 'Pallet wrap', weightKg: 12 },
    ])

    expect(order.events).toEqual([{ status: 'received', at: order.placedAt }])
    expect(listOrders(source)[0].number).toBe('OR-2061')
  })

  it('updates an open order, keeping its number, status and history', () => {
    const before = JSON.parse(JSON.stringify(getOrder(source, 'OR-2041'))) as Order

    const order = updateOrder(source, 'OR-2041', {
      ...orderToInput(before),
      destination: '9 Quay St',
      packages: [{ contents: 'Cold boxes', weightKg: 18 }],
      total: 4200,
    })

    expect(order).toMatchObject({
      number: before.number,
      status: before.status,
      placedAt: before.placedAt,
      events: before.events,
      destination: '9 Quay St',
      total: 4200,
    })

    expect(order.packages).toEqual([{ label: 'PKG-1', contents: 'Cold boxes', weightKg: 18 }])
  })

  it('refuses to update a completed or cancelled order', () => {
    const completed = seedOrder('OR-2001')

    expect(isOrderEditable(completed)).toBe(false)
    expect(isOrderEditable(seedOrder('OR-2041'))).toBe(true)

    expect(() => updateOrder(source, 'OR-2001', orderToInput(completed))).toThrow(
      'OR-2001 is completed and cannot be edited',
    )
  })

  it('turns an order into form input that the schema accepts', () => {
    expect(orderSchema.parse(orderToInput(seedOrder('OR-2041')))).toBeTruthy()
  })

  it('cancels an open order, and refuses a completed or cancelled one', () => {
    expect(cancelOrder(source, 'OR-2041').status).toBe('cancelled')
    expect(getOrder(source, 'OR-2041')?.events.at(-1)?.status).toBe('cancelled')
    expect(() => cancelOrder(source, 'OR-2001')).toThrow()
    expect(() => cancelOrder(source, 'OR-2041')).toThrow()
  })
})
