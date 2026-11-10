/**
 * The shipments repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import { getOrder } from '../src/modules/orders/data/index.js'
import {
  activeShipments,
  addOrderToShipment,
  candidateOrders,
  candidateVehicles,
  createShipment,
  getShipment,
  isShipmentEditable,
  listShipments,
  plannedStops,
  runsFor,
  shipmentProgress,
  shipmentToInput,
  updateShipment,
} from '../src/modules/shipments/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('shipments', () => {
  it('lists, finds and filters', () => {
    expect(listShipments(source)).toHaveLength(18)
    expect(listShipments(source, { status: 'delivered' })).toHaveLength(5)
    expect(getShipment(source, 'SHP-3006')?.status).toBe('out-for-delivery')
    expect(activeShipments(source)).toHaveLength(13)

    expect(
      activeShipments(source)
        .map((shipment) => shipment.status)
        .slice(0, 2),
    ).toEqual(['delayed', 'out-for-delivery'])
  })

  const order = (number: string) => {
    const found = getOrder(source, number)

    if (!found) throw new Error(`no ${number}`)

    return found
  }

  const run = {
    originId: 'loc-riverside',
    vehicleId: 'veh-van-026',
    driverId: 'drv-lopez',
    orderIds: ['or-2049', 'or-2045'],
  }

  it('offers the ready orders at an origin that are on no shipment', () => {
    const numbers = (originId: string, shipmentId: string | null = null) =>
      candidateOrders(source, originId, shipmentId).map((candidate) => candidate.number)

    expect(numbers('loc-riverside')).toEqual(['OR-2045', 'OR-2049', 'OR-2053'])

    expect(numbers('loc-market', 'shp-3015')).toEqual([
      'OR-2036',
      'OR-2040',
      'OR-2044',
      'OR-2048',
      'OR-2052',
    ])
  })

  it('offers vehicles out of the workshop, those based at the origin first', () => {
    const codes = candidateVehicles(source, 'loc-north', null).map((vehicle) => vehicle.code)

    expect(codes.slice(0, 2)).toEqual(['VAN-018', 'TRK-212'])
    expect(codes).not.toContain('VAN-022')
    expect(codes).toHaveLength(11)
  })

  it('plans stops from the orders, 45 minutes apart from 09:00 tomorrow', () => {
    expect(plannedStops(source, ['or-2049', 'or-2045', 'or-2053'])).toEqual([
      { address: order('OR-2049').destination, eta: { day: 1, time: '09:00' }, deliveredAt: null },
      { address: order('OR-2045').destination, eta: { day: 1, time: '09:45' }, deliveredAt: null },
      { address: order('OR-2053').destination, eta: { day: 1, time: '10:30' }, deliveredAt: null },
    ])
  })

  it('schedules a run and moves its orders into fulfilment', () => {
    const shipment = createShipment(source, run)

    expect(shipment).toMatchObject({
      number: 'SHP-3019',
      status: 'scheduled',
      orderIds: run.orderIds,
    })

    expect(shipment.stops).toHaveLength(2)

    for (const number of ['OR-2049', 'OR-2045']) {
      expect(order(number)).toMatchObject({ status: 'in-fulfilment', shipmentId: shipment.id })
      expect(order(number).events.at(-1)?.status).toBe('in-fulfilment')
    }

    expect(candidateOrders(source, 'loc-riverside', null).map((order) => order.number)).toEqual([
      'OR-2053',
    ])
  })

  it('replans a scheduled run: an unticked order goes back to ready', () => {
    const shipment = createShipment(source, run)

    updateShipment(source, shipment.number, { ...run, orderIds: ['or-2045', 'or-2053'] })

    expect(order('OR-2049')).toMatchObject({ status: 'ready', shipmentId: null })
    expect(order('OR-2049').events.at(-1)?.status).toBe('ready')
    expect(order('OR-2053')).toMatchObject({ status: 'in-fulfilment', shipmentId: shipment.id })

    expect(shipment.stops.map((stop) => stop.address)).toEqual([
      order('OR-2045').destination,
      order('OR-2053').destination,
    ])
  })

  it('refuses an order that is not ready at the origin, and a run already under way', () => {
    expect(() => createShipment(source, { ...run, orderIds: ['or-2041'] })).toThrow(
      "OR-2041 isn't ready at this origin",
    )

    const moving = getShipment(source, 'SHP-3006')

    if (!moving) throw new Error('no SHP-3006')

    expect(isShipmentEditable(moving)).toBe(false)

    expect(() => updateShipment(source, 'SHP-3006', shipmentToInput(moving))).toThrow(
      'SHP-3006 is out for delivery and cannot be replanned',
    )
  })

  it('measures progress as delivered stops over stops', () => {
    expect(shipmentProgress(getShipment(source, 'SHP-3006')!)).toBe(50)
    expect(shipmentProgress(getShipment(source, 'SHP-3001')!)).toBe(100)
    expect(shipmentProgress(getShipment(source, 'SHP-3015')!)).toBe(0)
  })

  it('puts a ready order on a scheduled run from its origin, and replans the stops', () => {
    const run = source.data.shipments.find((shipment) => shipment.status === 'scheduled')

    if (!run) throw new Error('The seed has no scheduled run')

    const order = candidateOrders(source, run.originId, null)[0]

    if (!order) throw new Error('No ready order at the run’s origin')

    expect(runsFor(source, order).map((candidate) => candidate.number)).toContain(run.number)

    const updated = addOrderToShipment(source, run.number, order.number)

    expect(updated.orderIds).toContain(order.id)
    expect(updated.stops).toHaveLength(updated.orderIds.length)
    expect(getOrder(source, order.number)?.status).toBe('in-fulfilment')
  })

  it('refuses an order that is not ready, or a run that has left', () => {
    const scheduled = source.data.shipments.find((shipment) => shipment.status === 'scheduled')
    const moving = source.data.shipments.find((shipment) => shipment.status === 'in-transit')

    if (!scheduled || !moving) throw new Error('The seed lacks a scheduled or moving run')

    const received = source.data.orders.find((order) => order.status === 'received')
    const ready = candidateOrders(source, moving.originId, null)[0]

    if (!received || !ready) throw new Error('The seed lacks a received or ready order')

    expect(() => addOrderToShipment(source, scheduled.number, received.number)).toThrow(
      `${received.number} is received and cannot go on a run`,
    )

    expect(() => addOrderToShipment(source, moving.number, ready.number)).toThrow(
      `${moving.number} is in transit and takes no more orders`,
    )
  })
})
