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
