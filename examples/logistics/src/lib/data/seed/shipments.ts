/**
 * Eighteen shipments: five delivered (four completed orders each), then the
 * active ones carrying the in-fulfilment orders. Stops are the carried
 * orders' destinations, in order; delivered stops have a delivery time.
 */
import type { Shipment, Stop } from '../types.js'
import { ORDERS } from './orders.js'

type Row = [
  number: number,
  vehicle: string,
  driver: string,
  status: Shipment['status'],
  day: number,
]

const ROWS: Row[] = [
  [3001, 'veh-van-014', 'drv-reyes', 'delivered', -12],
  [3002, 'veh-trk-208', 'drv-cole', 'delivered', -10],
  [3003, 'veh-van-016', 'drv-ibrahim', 'delivered', -8],
  [3004, 'veh-van-018', 'drv-park', 'delivered', -6],
  [3005, 'veh-trk-210', 'drv-santos', 'delivered', -4],
  [3006, 'veh-van-014', 'drv-reyes', 'out-for-delivery', 0],
  [3007, 'veh-van-016', 'drv-ibrahim', 'out-for-delivery', 0],
  [3008, 'veh-van-020', 'drv-walsh', 'out-for-delivery', 0],
  [3009, 'veh-trk-208', 'drv-cole', 'in-transit', 0],
  [3010, 'veh-trk-210', 'drv-santos', 'in-transit', 0],
  [3011, 'veh-van-018', 'drv-park', 'in-transit', 0],
  [3012, 'veh-trk-212', 'drv-nguyen', 'in-transit', 0],
  [3013, 'veh-van-024', 'drv-fischer', 'in-transit', 0],
  [3014, 'veh-trk-212', 'drv-nguyen', 'delayed', 0],
  [3015, 'veh-van-024', 'drv-fischer', 'scheduled', 1],
  [3016, 'veh-van-020', 'drv-walsh', 'scheduled', 1],
  [3017, 'veh-van-014', 'drv-reyes', 'scheduled', 2],
  [3018, 'veh-trk-208', 'drv-cole', 'scheduled', 2],
]

function stopsFor(orderIds: string[], status: Shipment['status'], day: number): Stop[] {
  return orderIds.map((orderId, index) => {
    const order = ORDERS.find((candidate) => candidate.id === orderId)
    const eta = { day, time: `${String(10 + index * 2).padStart(2, '0')}:00` }
    const delivered = status === 'delivered' || (status === 'out-for-delivery' && index === 0)

    return { address: order?.destination ?? '', eta, deliveredAt: delivered ? eta : null }
  })
}

export const SHIPMENTS: Shipment[] = ROWS.map(([number, vehicleId, driverId, status, day]) => {
  const id = `shp-${number}`
  const orderIds = ORDERS.filter((order) => order.shipmentId === id).map((order) => order.id)
  const originId = ORDERS.find((order) => order.id === orderIds[0])?.originId ?? 'loc-riverside'

  return {
    id,
    number: `SHP-${number}`,
    vehicleId,
    driverId,
    originId,
    orderIds,
    stops: stopsFor(orderIds, status, day),
    status,
  }
})
