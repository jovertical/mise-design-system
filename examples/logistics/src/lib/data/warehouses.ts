import { percent, type Source } from './shared.js'
import type { Location } from './types.js'

export const listLocations = (s: Source) => s.data.locations

export const utilisation = (location: Location) =>
  percent(
    location.zones.reduce((sum, zone) => sum + zone.used, 0),
    location.zones.reduce((sum, zone) => sum + zone.capacity, 0),
  )

export const zoneShare = (zone: Location['zones'][number]) => percent(zone.used, zone.capacity)
