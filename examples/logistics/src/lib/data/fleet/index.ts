import { matches, type Source, tally } from '../shared.js'
import type { Driver, Id, Vehicle, VehicleStatus } from '../types.js'
import { type VehicleInput, vehicleSchema } from './schema.js'

export const VEHICLE_STATUSES = ['on-route', 'loading', 'idle', 'workshop'] as const
export const CONDITIONS = ['excellent', 'good', 'service-due', 'overdue'] as const

export type VehicleFilters = { search?: string; status?: VehicleStatus }

export const listVehicles = (source: Source, filters: VehicleFilters = {}): Vehicle[] =>
  source.data.vehicles
    .filter((vehicle) => !filters.status || vehicle.status === filters.status)
    .filter((vehicle) => matches(filters.search, vehicle.code, vehicle.registration))

export const fleetStatus = (source: Source) =>
  tally(
    VEHICLE_STATUSES,
    source.data.vehicles.map((vehicle) => vehicle.status),
  )

export const fleetCondition = (source: Source) =>
  tally(
    CONDITIONS,
    source.data.vehicles.map((vehicle) => vehicle.condition),
  )

/** Due within the window, overdue included. */
export const serviceDueSoon = (source: Source, withinDays = 7) =>
  source.data.vehicles.filter((vehicle) => vehicle.nextServiceDay <= withinDays)

export const getVehicle = (source: Source, idOrCode: string) =>
  source.data.vehicles.find(
    (vehicle) => vehicle.id === idOrCode || vehicle.code === idOrCode.toUpperCase(),
  )

/** Every shipment the vehicle has run, most recent first. */
export const vehicleShipments = (source: Source, vehicleId: string) =>
  source.data.shipments
    .filter((shipment) => shipment.vehicleId === vehicleId)
    .toSorted((first, second) => second.number.localeCompare(first.number))

export const vehicleToInput = (vehicle: Vehicle): VehicleInput => ({
  code: vehicle.code,
  registration: vehicle.registration,
  type: vehicle.type,
  homeLocationId: vehicle.homeLocationId,
  driverId: vehicle.driverId,
  mileageKm: vehicle.mileageKm,
  nextServiceDay: vehicle.nextServiceDay,
  condition: vehicle.condition,
})

/** Drivers with no vehicle, plus whoever already drives this one. */
export const assignableDrivers = (source: Source, vehicleId: Id | null): Driver[] =>
  source.data.drivers.filter(
    (driver) => driver.vehicleId === null || driver.vehicleId === vehicleId,
  )

function parseVehicle(source: Source, raw: VehicleInput, id: Id | null) {
  const input = vehicleSchema.parse(raw)

  const taken = source.data.vehicles.some(
    (vehicle) => vehicle.code === input.code && vehicle.id !== id,
  )

  if (taken) throw new Error(`${input.code} is already in use`)

  return input
}

/**
 * Pairs a vehicle with a driver, or with none, on both sides: the vehicle's
 * old driver is let go, and the new driver leaves whatever they drove.
 */
function assign(source: Source, vehicle: Vehicle, driverId: Id | null) {
  for (const driver of source.data.drivers) {
    if (driver.vehicleId === vehicle.id && driver.id !== driverId) driver.vehicleId = null
  }

  const driver = source.data.drivers.find((candidate) => candidate.id === driverId)

  if (driver) {
    const previous = source.data.vehicles.find((candidate) => candidate.id === driver.vehicleId)

    if (previous && previous.id !== vehicle.id) previous.driverId = null

    driver.vehicleId = vehicle.id
  }

  vehicle.driverId = driver ? driver.id : null
}

export function createVehicle(source: Source, raw: VehicleInput): Vehicle {
  const { driverId, ...input } = parseVehicle(source, raw, null)

  const vehicle: Vehicle = {
    ...input,
    id: `veh-${input.code.toLowerCase()}`,
    driverId: null,
    status: 'idle',
  }

  source.data.vehicles.push(vehicle)

  assign(source, vehicle, driverId)

  return vehicle
}

export function updateVehicle(source: Source, idOrCode: string, raw: VehicleInput): Vehicle {
  const vehicle = getVehicle(source, idOrCode)

  if (!vehicle) throw new Error(`No vehicle ${idOrCode}`)

  const { driverId, ...input } = parseVehicle(source, raw, vehicle.id)

  Object.assign(vehicle, input)

  assign(source, vehicle, driverId)

  return vehicle
}
