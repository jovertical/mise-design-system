/** The warehouses module's entities. */
import type { Id } from '#modules/core/data/types.js'

export type Location = {
  id: Id
  name: string
  city: string
  manager: string
  capacityUnits: number
  docks: number
  zones: { name: string; used: number; capacity: number }[]
}
