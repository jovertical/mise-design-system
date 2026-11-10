/**
 * The detail lookups repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import { getVehicle, vehicleShipments } from '../src/modules/fleet/data/index.js'
import { getProduct } from '../src/modules/products/data/index.js'
import { getLocation, locationActivity } from '../src/modules/warehouses/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('detail lookups', () => {
  it('finds records by the code their URL carries', () => {
    expect(getVehicle(source, 'van-014')?.code).toBe('VAN-014')
    expect(getProduct(source, 'pk-0410')?.name).toBe('Pallet wrap, 500 m')
    expect(getLocation(source, 'loc-harbour')?.name).toBe('Harbour Hub')
  })

  it("lists a vehicle's shipments and a site's activity", () => {
    expect(vehicleShipments(source, 'veh-van-014').map((shipment) => shipment.number)).toEqual([
      'SHP-3017',
      'SHP-3006',
      'SHP-3001',
    ])

    const harbour = locationActivity(source, 'loc-harbour')

    expect(harbour.vehicles.map((vehicle) => vehicle.code).sort()).toEqual([
      'TRK-208',
      'TRK-210',
      'TRK-214',
    ])

    expect(harbour.outbound.every((shipment) => shipment.status !== 'delivered')).toBe(true)
  })
})
