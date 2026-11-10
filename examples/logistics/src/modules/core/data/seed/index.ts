/**
 * The demo's starting state. Bump SEED_VERSION whenever the seed changes, in
 * shape or in content: a visitor's saved store is kept under the version, so
 * an unbumped change leaves earlier visitors on the old data.
 */
import type { Dataset } from '#modules/core/data/types.js'
import { CLIENTS } from './clients.js'
import { DRIVERS } from './drivers.js'
import { LOCATIONS } from './locations.js'
import { ORDERS } from './orders.js'
import { PRODUCTS } from './products.js'
import { SHIPMENTS } from './shipments.js'
import { VEHICLES } from './vehicles.js'

export const SEED_VERSION = 3

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
    legalName: 'mise Logistics Demo Co.',
    taxId: '00-0000000',
    supportEmail: 'support@logistics.example',
    phone: '+1 555 0100',
    website: 'https://logistics.example',
    address: {
      line1: '120 Riverside Drive',
      line2: '',
      city: 'Riverside',
      region: 'NY',
      postalCode: '10027',
    },
    logo: null,
    timezone: 'America/New_York',
    language: 'en-US',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    units: 'metric',
    dimensionUnit: 'cm',
    orderPrefix: 'OR-',
    shipmentPrefix: 'SHP-',
    invoicePrefix: 'INV-',
    deliveryConfirmations: true,
    proofOfDelivery: false,
  },
}
