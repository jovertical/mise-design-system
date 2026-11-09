import { beforeEach, describe, expect, it } from 'vitest'

import {
  clientOrders,
  createClient,
  getClient,
  listClients,
  openOrderValue,
} from '../src/lib/data/clients.js'
import { fleetCondition, fleetStatus, listVehicles, serviceDueSoon } from '../src/lib/data/fleet.js'
import {
  cancelOrder,
  createOrder,
  getOrder,
  listOrders,
  orderStats,
  ordersByStatus,
} from '../src/lib/data/orders.js'
import {
  change,
  deliveredThisWeek,
  deliveryTrend,
  ordersToday,
  pipeline,
  pipelineUrgency,
} from '../src/lib/data/overview.js'
import { listProducts, lowStock, productStock, updateProduct } from '../src/lib/data/products.js'
import { getSettings, saveSettings } from '../src/lib/data/settings.js'
import {
  activeShipments,
  getShipment,
  listShipments,
  shipmentProgress,
} from '../src/lib/data/shipments.js'
import { createStore, type Store } from '../src/lib/data/store.svelte.js'
import { listLocations, utilisation, zoneShare } from '../src/lib/data/warehouses.js'

let s: Store

beforeEach(() => {
  localStorage.clear()
  s = createStore()
})

describe('orders', () => {
  it('counts each open status with a seven-day trend', () => {
    const stats = orderStats(s)
    expect(stats.received.count).toBe(6)
    expect(stats.ready.count).toBe(14)
    expect(stats['in-fulfilment'].count).toBe(18)
    expect(stats.completed.count).toBe(20)
    expect(stats.ready.trend).toHaveLength(7)
  })

  it('lists newest first, searching number and client name', () => {
    expect(listOrders(s)[0].number).toBe('OR-2060')
    expect(listOrders(s, { search: 'or-2041' }).map((order) => order.number)).toEqual(['OR-2041'])
    expect(listOrders(s, { search: 'BLOOM' }).length).toBeGreaterThan(1)
    expect(listOrders(s, { status: 'received' })).toHaveLength(6)
  })

  it('finds an order by id or number', () => {
    expect(getOrder(s, 'OR-2041')?.status).toBe('ready')
    expect(getOrder(s, 'or-2041')?.number).toBe('OR-2041')
    expect(getOrder(s, 'does-not-exist')).toBeUndefined()
  })

  it('groups orders by status for the board', () => {
    expect(ordersByStatus(s).ready).toHaveLength(14)
    expect(ordersByStatus(s).cancelled).toHaveLength(2)
  })

  it('creates an order with the next number, received today', () => {
    const order = createOrder(s, {
      clientId: s.data.clients[0].id,
      service: 'express',
      originId: 'loc-riverside',
      destination: '12 Dock Rd',
      weightKg: 40,
      total: 5600,
    })
    expect(order).toMatchObject({ number: 'OR-2061', status: 'received', shipmentId: null })
    expect(order.events).toEqual([{ status: 'received', at: order.placedAt }])
    expect(listOrders(s)[0].number).toBe('OR-2061')
  })

  it('cancels an open order, and refuses a completed or cancelled one', () => {
    expect(cancelOrder(s, 'OR-2041').status).toBe('cancelled')
    expect(getOrder(s, 'OR-2041')?.events.at(-1)?.status).toBe('cancelled')
    expect(() => cancelOrder(s, 'OR-2001')).toThrow()
    expect(() => cancelOrder(s, 'OR-2041')).toThrow()
  })
})

describe('shipments', () => {
  it('lists, finds and filters', () => {
    expect(listShipments(s)).toHaveLength(18)
    expect(listShipments(s, { status: 'delivered' })).toHaveLength(5)
    expect(getShipment(s, 'SHP-3006')?.status).toBe('out-for-delivery')
    expect(activeShipments(s)).toHaveLength(13)
    expect(
      activeShipments(s)
        .map((shipment) => shipment.status)
        .slice(0, 2),
    ).toEqual(['delayed', 'out-for-delivery'])
  })

  it('measures progress as delivered stops over stops', () => {
    expect(shipmentProgress(getShipment(s, 'SHP-3006')!)).toBe(50)
    expect(shipmentProgress(getShipment(s, 'SHP-3001')!)).toBe(100)
    expect(shipmentProgress(getShipment(s, 'SHP-3015')!)).toBe(0)
  })
})

describe('fleet', () => {
  it('counts vehicles by status and condition, with shares', () => {
    expect(fleetStatus(s)['on-route']).toEqual({ count: 7, share: 58 })
    expect(fleetCondition(s).excellent.count).toBe(6)
    expect(listVehicles(s, { status: 'idle' })).toHaveLength(2)
  })

  it('finds vehicles due for service within a week, overdue ones included', () => {
    expect(
      serviceDueSoon(s)
        .map((vehicle) => vehicle.code)
        .sort(),
    ).toEqual(['TRK-208', 'TRK-210', 'TRK-212', 'VAN-022'])
  })
})

describe('products', () => {
  it('sums stock across locations', () => {
    const wrap = listProducts(s, { search: 'PK-0410' })[0]
    expect(productStock(wrap)).toEqual({ onHand: 1240, reserved: 310, available: 930 })
  })

  it('finds the products below their reorder point', () => {
    expect(
      lowStock(s)
        .map((product) => product.sku)
        .sort(),
    ).toEqual(['CC-3008', 'PK-0422', 'PK-0462', 'PL-1020'])
  })

  it('updates only price and reorder point', () => {
    const product = updateProduct(s, 'prd-pk-0422', { price: 990, reorderPoint: 80 })
    expect(product).toMatchObject({ price: 990, reorderPoint: 80, sku: 'PK-0422' })
  })
})

describe('warehouses', () => {
  it('measures utilisation across zones', () => {
    const riverside = listLocations(s)[0]
    expect(utilisation(riverside)).toBe(78)
    expect(zoneShare(riverside.zones[0])).toBe(93)
  })
})

describe('clients', () => {
  it('finds a client, its orders and open value', () => {
    const coastal = listClients(s, { search: 'coastal' })[0]
    expect(getClient(s, coastal.id)?.name).toBe('Coastal Grocers')
    expect(clientOrders(s, coastal.id).length).toBeGreaterThan(0)
    expect(openOrderValue(s, coastal.id)).toBeGreaterThan(0)
  })

  it('adds a client', () => {
    const client = createClient(s, {
      name: 'Pine Street Deli',
      industry: 'Food',
      contact: 'H. Boyd',
      email: 'boyd@pinestreetdeli.example',
      city: 'Riverside',
    })
    expect(client).toMatchObject({ status: 'active', lifetimeValue: 0 })
    expect(listClients(s)).toHaveLength(15)
  })
})

describe('overview', () => {
  it('counts the pipeline as packed, shipped and delivered', () => {
    expect(pipeline(s)).toEqual({
      packed: { count: 14, share: 27 },
      shipped: { count: 18, share: 35 },
      delivered: { count: 20, share: 38 },
    })
  })

  it('counts the express and same-day orders in each stage', () => {
    const urgency = pipelineUrgency(s)
    const ready = s.data.orders.filter((order) => order.status === 'ready')
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
    const today = ordersToday(s)
    expect(today.count).toBe(s.data.orders.filter((order) => order.placedAt.day === 0).length)
    expect(Math.abs(today.change)).toBeLessThan(200)
    expect(typeof deliveredThisWeek(s).change).toBe('number')
    expect(deliveredThisWeek(s).count).toBe(
      deliveryTrend(s).reduce((sum, d) => sum + d.delivered, 0),
    )
  })

  it('charts the last seven days', () => {
    const trend = deliveryTrend(s)
    expect(trend).toHaveLength(7)
    expect(trend.at(-1)?.day).toBe('14 Jul')
    expect(trend.reduce((sum, point) => sum + point.placed, 0)).toBeGreaterThan(0)
  })
})

describe('settings', () => {
  it('reads and saves', () => {
    saveSettings(s, { ...getSettings(s), companyName: 'Renamed Co' })
    expect(getSettings(s).companyName).toBe('Renamed Co')
  })
})
