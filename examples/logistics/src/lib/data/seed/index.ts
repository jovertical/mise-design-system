/**
 * The demo's starting state. Bump SEED_VERSION whenever the seed changes, in
 * shape or in content: a visitor's saved store is kept under the version, so
 * an unbumped change leaves earlier visitors on the old data.
 */
import type { Dataset } from '../types.js'
import { CLIENTS } from './clients.js'
import { DRIVERS } from './drivers.js'
import { LOCATIONS } from './locations.js'
import { ORDERS } from './orders.js'
import { PRODUCTS } from './products.js'
import { SHIPMENTS } from './shipments.js'
import { VEHICLES } from './vehicles.js'

export const SEED_VERSION = 2

export const SEED: Dataset = {
  locations: LOCATIONS,
  vehicles: VEHICLES,
  drivers: DRIVERS,
  clients: CLIENTS,
  products: PRODUCTS,
  orders: ORDERS,
  shipments: SHIPMENTS,
  settings: {
    companyName: 'mise Logistics',
    timezone: 'America/New_York',
    units: 'metric',
    deliveryConfirmations: true,
    proofOfDelivery: false,
  },
}
