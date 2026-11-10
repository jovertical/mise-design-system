/**
 * The warehouses repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/lib/data/store.svelte.js'
import {
  createSite,
  getLocation,
  listLocations,
  locationStock,
  siteToInput,
  updateSite,
  utilisation,
  zoneShare,
} from '../src/lib/data/warehouses/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('warehouses', () => {
  it('measures utilisation across zones', () => {
    const riverside = listLocations(source)[0]

    expect(utilisation(riverside)).toBe(78)
    expect(zoneShare(riverside.zones[0])).toBe(93)
  })

  it('counts the products and units a site holds', () => {
    const market = locationStock(source, 'loc-market')

    expect(market.skus).toBe(4)
    expect(market.units).toBe(90 + 8 + 60 + 20)
  })

  const riverside = () => {
    const location = getLocation(source, 'loc-riverside')

    if (!location) throw new Error('no Riverside DC')

    return location
  }

  it('adds a site with empty zones', () => {
    const site = createSite(source, {
      name: 'East Gate',
      city: 'Eastport',
      manager: 'P. Ruiz',
      capacityUnits: 5000,
      docks: 3,
      zones: [{ name: 'Zone A', capacity: 2500 }],
    })

    expect(site).toMatchObject({ id: 'loc-east-gate', docks: 3 })
    expect(site.zones).toEqual([{ name: 'Zone A', used: 0, capacity: 2500 }])
    expect(listLocations(source)).toHaveLength(5)
  })

  it('updates a site, keeping what each kept zone holds', () => {
    const input = siteToInput(riverside())

    input.zones[1] = { name: 'Zone B, mezzanine', capacity: 4500 }

    input.zones.push({ name: 'Returns', capacity: 800 })

    const site = updateSite(source, 'loc-riverside', { ...input, docks: 10 })

    expect(site.docks).toBe(10)
    expect(site.zones[1]).toEqual({ name: 'Zone B, mezzanine', used: 2560, capacity: 4500 })
    expect(site.zones.at(-1)).toEqual({ name: 'Returns', used: 0, capacity: 800 })
  })

  it('refuses to shrink a zone below what it holds, or drop one that holds stock', () => {
    const input = siteToInput(riverside())

    const shrunk = input.zones.map((zone, index) =>
      index === 0 ? { ...zone, capacity: 100 } : zone,
    )

    expect(() => updateSite(source, 'loc-riverside', { ...input, zones: shrunk })).toThrow(
      "Zone A holds 2,790; its capacity can't go below that",
    )

    expect(() =>
      updateSite(source, 'loc-riverside', { ...input, zones: input.zones.slice(0, 3) }),
    ).toThrow('Bulk still holds stock')

    expect(riverside().zones).toHaveLength(4)
  })
})
