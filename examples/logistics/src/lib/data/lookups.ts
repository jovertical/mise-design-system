/** Names for ids, for display. A missing id reads as an em dash, never as blank. */
import type { Source } from './shared.js'
import type { Id } from './types.js'

const find = <T extends { id: Id }>(rows: T[], id: Id | null) =>
  id ? rows.find((row) => row.id === id) : undefined

export const locationName = (source: Source, id: Id | null) =>
  find(source.data.locations, id)?.name ?? '—'

export const clientOf = (source: Source, id: Id | null) => find(source.data.clients, id)
export const vehicleOf = (source: Source, id: Id | null) => find(source.data.vehicles, id)
export const driverOf = (source: Source, id: Id | null) => find(source.data.drivers, id)

/** Two initials for an avatar: "Coastal Grocers" → "CG". */
export const initials = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
