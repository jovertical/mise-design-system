/** The demo's shared primitives, and the dataset every module reads. Money is integer cents; dates are offsets from DEMO_TODAY. */
import type { Client } from '#modules/clients/data/types.js'
import type { Driver, Vehicle } from '#modules/fleet/data/types.js'
import type { Order } from '#modules/orders/data/types.js'
import type { Product } from '#modules/products/data/types.js'
import type { Settings } from '#modules/settings/data/types.js'
import type { Shipment } from '#modules/shipments/data/types.js'
import type { Location } from '#modules/warehouses/data/types.js'

export type Id = string

export type Cents = number

/** Days relative to DEMO_TODAY, plus a clock time: { day: -2, time: '09:30' }. */
export type DemoTime = { day: number; time: string }

export type Dataset = {
  locations: Location[]
  vehicles: Vehicle[]
  drivers: Driver[]
  clients: Client[]
  products: Product[]
  orders: Order[]
  shipments: Shipment[]
  settings: Settings
}
