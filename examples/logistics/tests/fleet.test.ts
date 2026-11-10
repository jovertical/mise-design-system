/**
 * The fleet repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import {
  assignableDrivers,
  createVehicle,
  fleetCondition,
  fleetStatus,
  getVehicle,
  listVehicles,
  serviceDueSoon,
  updateVehicle,
  vehicleToInput,
} from '../src/modules/fleet/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('fleet', () => {
  it('counts vehicles by status and condition, with shares', () => {
    expect(fleetStatus(source)['on-route']).toEqual({ count: 7, share: 58 })
    expect(fleetCondition(source).excellent.count).toBe(6)
    expect(listVehicles(source, { status: 'idle' })).toHaveLength(2)
  })

  it('finds vehicles due for service within a week, overdue ones included', () => {
    expect(
      serviceDueSoon(source)
        .map((vehicle) => vehicle.code)
        .sort(),
    ).toEqual(['TRK-208', 'TRK-210', 'TRK-212', 'VAN-022'])
  })

  const newVan = {
    code: 'VAN-030',
    registration: 'RV-2090',
    type: 'van' as const,
    homeLocationId: 'loc-riverside',
    driverId: null,
    mileageKm: 120,
    nextServiceDay: 180,
    condition: 'excellent' as const,
  }

  const driver = (id: string) => source.data.drivers.find((candidate) => candidate.id === id)

  it('adds a vehicle as idle', () => {
    const vehicle = createVehicle(source, newVan)

    expect(vehicle).toMatchObject({ id: 'veh-van-030', status: 'idle', driverId: null })
    expect(getVehicle(source, 'VAN-030')).toEqual(vehicle)
  })

  it('refuses a code another vehicle has', () => {
    expect(() => createVehicle(source, { ...newVan, code: 'TRK-212' })).toThrow(
      'TRK-212 is already in use',
    )

    const van = getVehicle(source, 'VAN-026')

    if (!van) throw new Error('no VAN-026')

    expect(() =>
      updateVehicle(source, 'VAN-026', { ...vehicleToInput(van), code: 'VAN-014' }),
    ).toThrow('VAN-014 is already in use')

    expect(updateVehicle(source, 'VAN-026', vehicleToInput(van)).code).toBe('VAN-026')
  })

  it('moves a driver from their vehicle to a new one, keeping both sides in step', () => {
    const vehicle = createVehicle(source, { ...newVan, driverId: 'drv-nguyen' })

    expect(vehicle.driverId).toBe('drv-nguyen')
    expect(driver('drv-nguyen')?.vehicleId).toBe(vehicle.id)
    expect(getVehicle(source, 'TRK-212')?.driverId).toBeNull()
  })

  it('unassigns a driver, and lists who can be assigned', () => {
    const truck = getVehicle(source, 'TRK-212')

    if (!truck) throw new Error('no TRK-212')

    updateVehicle(source, 'TRK-212', { ...vehicleToInput(truck), driverId: null })

    expect(truck.driverId).toBeNull()
    expect(driver('drv-nguyen')?.vehicleId).toBeNull()

    expect(assignableDrivers(source, null).map((driver) => driver.id)).toEqual([
      'drv-nguyen',
      'drv-adeyemi',
      'drv-lopez',
    ])

    const van = getVehicle(source, 'VAN-014')

    expect(assignableDrivers(source, van?.id ?? null).map((driver) => driver.id)).toContain(
      'drv-reyes',
    )
  })
})
