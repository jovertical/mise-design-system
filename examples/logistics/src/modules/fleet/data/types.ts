/** The fleet module's entities. */
import type { Id } from '#modules/core/data/types.js'

export type VehicleStatus = 'on-route' | 'loading' | 'idle' | 'workshop'

export type Vehicle = {
  id: Id
  code: string
  registration: string
  type: 'van' | 'truck'
  homeLocationId: Id
  driverId: Id | null
  status: VehicleStatus
  mileageKm: number
  nextServiceDay: number
  condition: 'excellent' | 'good' | 'service-due' | 'overdue'
}

export type Driver = {
  id: Id
  name: string
  phone: string
  vehicleId: Id | null
  licenceExpiryDay: number
  availability: 'on-shift' | 'off' | 'leave'
}
