/** The clients module's entities. */
import type { Cents, Id } from '#modules/core/data/types.js'

export type Client = {
  id: Id
  name: string
  industry: string
  contact: string
  email: string
  city: string
  manager: string
  status: 'active' | 'paused'
  lifetimeValue: Cents
}
