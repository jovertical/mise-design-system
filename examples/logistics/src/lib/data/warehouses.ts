import { type SiteInput, siteSchema } from './schemas.js'
import { percent, type Source } from './shared.js'
import type { Location } from './types.js'

export const listLocations = (s: Source) => s.data.locations

export const utilisation = (location: Location) =>
  percent(
    location.zones.reduce((sum, zone) => sum + zone.used, 0),
    location.zones.reduce((sum, zone) => sum + zone.capacity, 0),
  )

export const zoneShare = (zone: Location['zones'][number]) => percent(zone.used, zone.capacity)

/** How many products a site stocks, and how many units it holds on hand. */
export function locationStock(s: Source, id: Location['id']) {
  const rows = s.data.products.flatMap((product) =>
    product.stock.filter((row) => row.locationId === id),
  )

  return { skus: rows.length, units: rows.reduce((sum, row) => sum + row.onHand, 0) }
}

export const getLocation = (s: Source, id: string) =>
  s.data.locations.find((location) => location.id === id)

/** Vehicles based at the site, and the shipments leaving it that are not delivered. */
export function locationActivity(s: Source, id: string) {
  return {
    vehicles: s.data.vehicles.filter((vehicle) => vehicle.homeLocationId === id),
    outbound: s.data.shipments.filter(
      (shipment) => shipment.originId === id && shipment.status !== 'delivered',
    ),
  }
}

const units = new Intl.NumberFormat('en-US')

export const siteToInput = (location: Location): SiteInput => ({
  name: location.name,
  city: location.city,
  manager: location.manager,
  capacityUnits: location.capacityUnits,
  docks: location.docks,
  zones: location.zones.map(({ name, capacity }) => ({ name, capacity })),
})

export function createSite(s: Source, raw: SiteInput): Location {
  const { zones, ...input } = siteSchema.parse(raw)

  const site: Location = {
    ...input,
    id: `loc-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    zones: zones.map((zone) => ({ ...zone, used: 0 })),
  }

  s.data.locations.push(site)

  return site
}

/**
 * Zones line up by position: a kept zone keeps what it holds, and its
 * capacity can't drop below that; a zone past the new end must be empty.
 */
export function updateSite(s: Source, id: string, raw: SiteInput): Location {
  const site = getLocation(s, id)

  if (!site) throw new Error(`No site ${id}`)

  const { zones, ...input } = siteSchema.parse(raw)

  for (const [index, zone] of zones.entries()) {
    const used = site.zones[index]?.used ?? 0

    if (zone.capacity < used) {
      throw new Error(`${zone.name} holds ${units.format(used)}; its capacity can't go below that`)
    }
  }

  const dropped = site.zones.slice(zones.length).find((zone) => zone.used > 0)

  if (dropped) throw new Error(`${dropped.name} still holds stock`)

  Object.assign(site, input)

  site.zones = zones.map((zone, index) => ({ ...zone, used: site.zones[index]?.used ?? 0 }))

  return site
}
