import { matches, percent, type Source } from './shared.js'
import type { Shipment, ShipmentStatus } from './types.js'

export type ShipmentFilters = { search?: string; status?: ShipmentStatus; driverId?: string }

export function listShipments(s: Source, filters: ShipmentFilters = {}): Shipment[] {
  return s.data.shipments
    .filter((shipment) => !filters.status || shipment.status === filters.status)
    .filter((shipment) => !filters.driverId || shipment.driverId === filters.driverId)
    .filter((shipment) => matches(filters.search, shipment.number))
    .toSorted((a, b) => b.number.localeCompare(a.number))
}

export const getShipment = (s: Source, idOrNumber: string) =>
  s.data.shipments.find(
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

export const activeShipments = (s: Source) =>
  listShipments(s)
    .filter((shipment) => shipment.status !== 'delivered')
    .toSorted((a, b) => URGENCY[a.status] - URGENCY[b.status])

export const shipmentProgress = (shipment: Shipment) =>
  percent(shipment.stops.filter((stop) => stop.deliveredAt).length, shipment.stops.length)
