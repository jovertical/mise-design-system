/** The shipments module's entities. */
import type { DemoTime, Id } from '#modules/core/data/types.js'

export type ShipmentStatus =
  | 'scheduled'
  | 'in-transit'
  | 'out-for-delivery'
  | 'delivered'
  | 'delayed'

export type Stop = { address: string; eta: DemoTime; deliveredAt: DemoTime | null }

export type Shipment = {
  id: Id
  number: string
  vehicleId: Id
  driverId: Id
  originId: Id
  orderIds: Id[]
  stops: Stop[]
  status: ShipmentStatus
}
