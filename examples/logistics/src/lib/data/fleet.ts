import { matches, type Source, tally } from './shared.js'
import type { Vehicle, VehicleStatus } from './types.js'

export const VEHICLE_STATUSES = ['on-route', 'loading', 'idle', 'workshop'] as const
export const CONDITIONS = ['excellent', 'good', 'service-due', 'overdue'] as const

export type VehicleFilters = { search?: string; status?: VehicleStatus }

export const listVehicles = (s: Source, filters: VehicleFilters = {}): Vehicle[] =>
  s.data.vehicles
    .filter((vehicle) => !filters.status || vehicle.status === filters.status)
    .filter((vehicle) => matches(filters.search, vehicle.code, vehicle.registration))

export const fleetStatus = (s: Source) =>
  tally(
    VEHICLE_STATUSES,
    s.data.vehicles.map((vehicle) => vehicle.status),
  )

export const fleetCondition = (s: Source) =>
  tally(
    CONDITIONS,
    s.data.vehicles.map((vehicle) => vehicle.condition),
  )

/** Due within the window, overdue included. */
export const serviceDueSoon = (s: Source, withinDays = 7) =>
  s.data.vehicles.filter((vehicle) => vehicle.nextServiceDay <= withinDays)
