/** The orders module's entities. */
import type { Cents, DemoTime, Id } from '#modules/core/data/types.js'

export type OrderStatus = 'received' | 'ready' | 'in-fulfilment' | 'completed' | 'cancelled'

export type OrderEvent = { status: OrderStatus; at: DemoTime; note?: string }

export type Order = {
  id: Id
  number: string
  clientId: Id
  source: 'api' | 'portal' | 'csv' | 'manual'
  service: 'regular' | 'express' | 'same-day'
  originId: Id
  destination: string
  packages: { label: string; contents: string; weightKg: number }[]
  total: Cents
  status: OrderStatus
  placedAt: DemoTime
  events: OrderEvent[]
  shipmentId: Id | null
}
