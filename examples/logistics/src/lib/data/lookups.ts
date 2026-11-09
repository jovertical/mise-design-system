/** Names for ids, for display. A missing id reads as an em dash, never as blank. */
import type { Source } from './shared.js'
import type { Id } from './types.js'

const find = <T extends { id: Id }>(rows: T[], id: Id | null) =>
  id ? rows.find((row) => row.id === id) : undefined

export const locationName = (s: Source, id: Id | null) => find(s.data.locations, id)?.name ?? '—'
export const clientOf = (s: Source, id: Id | null) => find(s.data.clients, id)
export const vehicleOf = (s: Source, id: Id | null) => find(s.data.vehicles, id)
export const driverOf = (s: Source, id: Id | null) => find(s.data.drivers, id)

/** Two initials for an avatar: "Coastal Grocers" → "CG". */
export const initials = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
