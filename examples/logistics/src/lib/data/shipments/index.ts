import { matches, percent, type Source } from '../shared.js'
import type { DemoTime, Id, Order, Shipment, ShipmentStatus, Stop, Vehicle } from '../types.js'
import { type ShipmentInput, shipmentSchema } from './schema.js'

export type ShipmentFilters = { search?: string; status?: ShipmentStatus; driverId?: string }

export function listShipments(source: Source, filters: ShipmentFilters = {}): Shipment[] {
  return source.data.shipments
    .filter((shipment) => !filters.status || shipment.status === filters.status)
    .filter((shipment) => !filters.driverId || shipment.driverId === filters.driverId)
    .filter((shipment) => matches(filters.search, shipment.number))
    .toSorted((first, second) => second.number.localeCompare(first.number))
}

export const getShipment = (source: Source, idOrNumber: string) =>
  source.data.shipments.find(
    (shipment) =>
      shipment.id === idOrNumber.toLowerCase() || shipment.number === idOrNumber.toUpperCase(),
  )

/** Most urgent first: what needs a look today comes before what is merely booked. */
const URGENCY: Record<ShipmentStatus, number> = {
  delayed: 0,
  'out-for-delivery': 1,
  'in-transit': 2,
  scheduled: 3,
  delivered: 4,
}

export const activeShipments = (source: Source) =>
  listShipments(source)
    .filter((shipment) => shipment.status !== 'delivered')
    .toSorted((first, second) => URGENCY[first.status] - URGENCY[second.status])

export const shipmentProgress = (shipment: Shipment) =>
  percent(shipment.stops.filter((stop) => stop.deliveredAt).length, shipment.stops.length)

/** Only a run that has not left can be replanned. */
export const isShipmentEditable = (shipment: Shipment) => shipment.status === 'scheduled'

export const shipmentToInput = (shipment: Shipment): ShipmentInput => ({
  originId: shipment.originId,
  vehicleId: shipment.vehicleId,
  driverId: shipment.driverId,
  orderIds: [...shipment.orderIds],
})

/** Ready orders from the origin that are on no shipment, plus this run's own. */
export const candidateOrders = (source: Source, originId: Id, shipmentId: Id | null): Order[] =>
  source.data.orders
    .filter(
      (order) =>
        order.originId === originId &&
        ((order.status === 'ready' && order.shipmentId === null) ||
          (shipmentId !== null && order.shipmentId === shipmentId)),
    )
    .toSorted((first, second) => first.number.localeCompare(second.number))

/**
 * Every vehicle out of the workshop, those based at the origin first. A van
 * runs several scheduled runs, and a run may borrow one from another site.
 */
export const candidateVehicles = (
  source: Source,
  originId: Id,
  shipmentId: Id | null,
): Vehicle[] => {
  const own = source.data.shipments.find((shipment) => shipment.id === shipmentId)?.vehicleId

  const usable = source.data.vehicles.filter(
    (vehicle) => vehicle.status !== 'workshop' || vehicle.id === own,
  )

  return [
    ...usable.filter((vehicle) => vehicle.homeLocationId === originId),
    ...usable.filter((vehicle) => vehicle.homeLocationId !== originId),
  ]
}

const clock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

/** One stop per order, in order, from 09:00 tomorrow and 45 minutes apart. */
export const plannedStops = (source: Source, orderIds: Id[]): Stop[] =>
  orderIds.map((orderId, index) => ({
    address: source.data.orders.find((order) => order.id === orderId)?.destination ?? '',
    eta: { day: 1, time: clock(9 * 60 + index * 45) },
    deliveredAt: null,
  }))

const NOW: DemoTime = { day: 0, time: '12:00' }

function move(order: Order, status: 'ready' | 'in-fulfilment', shipmentId: Id | null) {
  order.status = status
  order.shipmentId = shipmentId

  order.events.push({ status, at: NOW })
}

function parseRun(source: Source, raw: ShipmentInput, shipmentId: Id | null) {
  const input = shipmentSchema.parse(raw)

  const allowed = new Set(
    candidateOrders(source, input.originId, shipmentId).map((order) => order.id),
  )

  for (const orderId of input.orderIds) {
    if (!allowed.has(orderId)) {
      const number = source.data.orders.find((order) => order.id === orderId)?.number ?? orderId

      throw new Error(`${number} isn't ready at this origin`)
    }
  }

  return input
}

export function createShipment(source: Source, raw: ShipmentInput): Shipment {
  const input = parseRun(source, raw, null)

  const highest = Math.max(
    ...source.data.shipments.map((shipment) => Number(shipment.number.slice(4))),
  )

  const number = `SHP-${highest + 1}`

  const shipment: Shipment = {
    ...input,
    id: number.toLowerCase(),
    number,
    stops: plannedStops(source, input.orderIds),
    status: 'scheduled',
  }

  source.data.shipments.push(shipment)

  for (const order of source.data.orders) {
    if (input.orderIds.includes(order.id)) move(order, 'in-fulfilment', shipment.id)
  }

  // The store keeps its own reactive copy; hand that back, so a caller's later
  // edits land on the stored run.
  return getShipment(source, number) ?? shipment
}

/** Applies the difference: a newly ticked order moves in, an unticked one goes back to ready. */
export function updateShipment(source: Source, idOrNumber: string, raw: ShipmentInput): Shipment {
  const shipment = getShipment(source, idOrNumber)

  if (!shipment) throw new Error(`No shipment ${idOrNumber}`)

  if (!isShipmentEditable(shipment)) {
    const status = shipment.status.replaceAll('-', ' ')

    throw new Error(`${shipment.number} is ${status} and cannot be replanned`)
  }

  const input = parseRun(source, raw, shipment.id)

  for (const order of source.data.orders) {
    const was = shipment.orderIds.includes(order.id)
    const now = input.orderIds.includes(order.id)

    if (was && !now) move(order, 'ready', null)

    if (!was && now) move(order, 'in-fulfilment', shipment.id)
  }

  Object.assign(shipment, input, { stops: plannedStops(source, input.orderIds) })

  return shipment
}
