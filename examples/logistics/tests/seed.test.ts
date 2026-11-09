import { describe, expect, it } from 'vitest'

import { SEED } from '../src/lib/data/seed/index.js'

const ids = <T extends { id: string }>(rows: T[]) => new Set(rows.map((row) => row.id))
const count = <T>(rows: T[], pick: (row: T) => string) =>
  rows.reduce<Record<string, number>>((tally, row) => {
    tally[pick(row)] = (tally[pick(row)] ?? 0) + 1
    return tally
  }, {})

describe('the seed', () => {
  const locations = ids(SEED.locations)
  const vehicles = ids(SEED.vehicles)
  const drivers = ids(SEED.drivers)
  const clients = ids(SEED.clients)
  const orders = ids(SEED.orders)
  const shipments = ids(SEED.shipments)

  it('has the counts the spec names', () => {
    expect([
      SEED.locations.length,
      SEED.vehicles.length,
      SEED.drivers.length,
      SEED.clients.length,
      SEED.products.length,
      SEED.orders.length,
      SEED.shipments.length,
    ]).toEqual([4, 12, 10, 14, 24, 60, 18])
  })

  it('has unique ids and numbers', () => {
    for (const rows of Object.values(SEED).filter(Array.isArray)) {
      expect(ids(rows as { id: string }[]).size).toBe(rows.length)
    }
    expect(new Set(SEED.orders.map((order) => order.number)).size).toBe(60)
  })

  it('resolves every reference', () => {
    for (const order of SEED.orders) {
      expect(clients.has(order.clientId), order.number).toBe(true)
      expect(locations.has(order.originId), order.number).toBe(true)
      if (order.shipmentId) expect(shipments.has(order.shipmentId), order.number).toBe(true)
    }
    for (const shipment of SEED.shipments) {
      expect(vehicles.has(shipment.vehicleId)).toBe(true)
      expect(drivers.has(shipment.driverId)).toBe(true)
      expect(locations.has(shipment.originId)).toBe(true)
      expect(shipment.orderIds.length).toBeGreaterThan(0)
      for (const id of shipment.orderIds) expect(orders.has(id)).toBe(true)
      expect(shipment.stops).toHaveLength(shipment.orderIds.length)
    }
    for (const vehicle of SEED.vehicles) {
      expect(locations.has(vehicle.homeLocationId)).toBe(true)
      if (vehicle.driverId) expect(drivers.has(vehicle.driverId)).toBe(true)
    }
    for (const product of SEED.products) {
      for (const stock of product.stock) expect(locations.has(stock.locationId)).toBe(true)
    }
  })

  it('spreads statuses as the screens need them', () => {
    expect(count(SEED.orders, (order) => order.status)).toEqual({
      completed: 20,
      cancelled: 2,
      'in-fulfilment': 18,
      ready: 14,
      received: 6,
    })
    expect(count(SEED.shipments, (shipment) => shipment.status)).toEqual({
      delivered: 5,
      'out-for-delivery': 3,
      'in-transit': 5,
      delayed: 1,
      scheduled: 4,
    })
    expect(count(SEED.vehicles, (vehicle) => vehicle.status)).toEqual({
      'on-route': 7,
      loading: 2,
      workshop: 1,
      idle: 2,
    })
    expect(count(SEED.vehicles, (vehicle) => vehicle.condition)).toEqual({
      excellent: 6,
      good: 3,
      'service-due': 2,
      overdue: 1,
    })
  })

  it('ends every order history on its status, never in the future', () => {
    for (const order of SEED.orders) {
      expect(order.events.at(-1)?.status, order.number).toBe(order.status)
      expect(order.events[0]).toMatchObject({ status: 'received', at: order.placedAt })
      for (const event of order.events) expect(event.at.day).toBeLessThanOrEqual(0)
    }
  })

  it('keeps money in positive whole cents', () => {
    for (const order of SEED.orders)
      expect(Number.isInteger(order.total) && order.total > 0).toBe(true)
    for (const product of SEED.products) expect(Number.isInteger(product.price)).toBe(true)
  })

  it('has the order the detail page is drawn from', () => {
    const order = SEED.orders.find((candidate) => candidate.number === 'OR-2041')
    const client = SEED.clients.find((candidate) => candidate.id === order?.clientId)
    expect(order).toMatchObject({
      status: 'ready',
      service: 'express',
      destination: '199 Water St',
    })
    expect(client?.name).toBe('Bloom & Stem')
    expect(order?.packages).toHaveLength(2)
  })
})
