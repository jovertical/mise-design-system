import { describe, expect, it } from 'vitest'

import {
  clientReadiness,
  orderReadiness,
  productReadiness,
  siteReadiness,
  vehicleReadiness,
} from '../src/lib/data/readiness.js'
import type {
  ClientInput,
  OrderInput,
  ProductInput,
  SiteInput,
  VehicleInput,
} from '../src/lib/data/schemas.js'

const unmet = (items: { label: string; status: string }[]) =>
  items.filter((item) => item.status !== 'met').map((item) => item.label)

const blankOrder: OrderInput = {
  clientId: '',
  service: 'regular',
  originId: 'loc-riverside',
  destination: '',
  packages: [{ contents: '', weightKg: 0 }],
  total: 0,
}

const fullOrder: OrderInput = {
  clientId: 'cli-coastal-grocers',
  service: 'express',
  originId: 'loc-riverside',
  destination: '12 Dock Rd',
  packages: [{ contents: 'Crates', weightKg: 40 }],
  total: 5600,
}

describe('order readiness', () => {
  it('lists every requirement as unmet on a new order', () => {
    expect(unmet(orderReadiness(blankOrder))).toEqual([
      'Client chosen',
      'Origin and delivery address',
      'At least one package with a weight',
      'Total set',
    ])
  })

  it('meets every requirement on a complete order', () => {
    expect(unmet(orderReadiness(fullOrder))).toEqual([])
  })

  it('wants a weight on some package, not just a row', () => {
    const items = orderReadiness({ ...fullOrder, packages: [{ contents: 'Crates', weightKg: 0 }] })
    expect(unmet(items)).toEqual(['At least one package with a weight'])
  })
})

const blankClient: ClientInput = {
  name: '',
  industry: '',
  city: '',
  contact: '',
  email: '',
  manager: 'Ops manager',
  status: 'active',
}

describe('client readiness', () => {
  it('lists what a new client still needs', () => {
    expect(unmet(clientReadiness(blankClient))).toEqual(['Named', 'Contact and email', 'City'])
  })

  it('wants an email that looks like one', () => {
    const client = { ...blankClient, name: 'Pine Deli', city: 'Riverside', contact: 'H. Boyd' }
    expect(unmet(clientReadiness({ ...client, email: 'boyd' }))).toEqual(['Contact and email'])
    expect(unmet(clientReadiness({ ...client, email: 'boyd@pine.example' }))).toEqual([])
  })
})

const blankProduct: ProductInput = {
  name: '',
  sku: '',
  category: 'packaging',
  unit: '',
  price: 0,
  reorderPoint: 0,
  openingStock: [],
}

describe('product readiness', () => {
  it('lists what a new product still needs', () => {
    expect(unmet(productReadiness(blankProduct))).toEqual(['Named', 'SKU', 'Unit', 'Price set'])
  })

  it('wants a SKU in the right shape', () => {
    const product = { ...blankProduct, name: 'Stretch film', unit: 'roll', price: 1450 }
    expect(unmet(productReadiness({ ...product, sku: 'pk 1' }))).toEqual(['SKU'])
    expect(unmet(productReadiness({ ...product, sku: 'PK-0499' }))).toEqual([])
  })
})

const blankVehicle: VehicleInput = {
  code: '',
  registration: '',
  type: 'van',
  homeLocationId: '',
  driverId: null,
  mileageKm: 0,
  nextServiceDay: 180,
  condition: 'excellent',
}

describe('vehicle readiness', () => {
  it('lists what a new vehicle still needs', () => {
    expect(unmet(vehicleReadiness(blankVehicle))).toEqual(['Code', 'Registration', 'Home site'])
  })

  it('wants a code in the fleet shape', () => {
    const van = { ...blankVehicle, registration: 'RV-2090', homeLocationId: 'loc-riverside' }
    expect(unmet(vehicleReadiness({ ...van, code: 'VAN-30' }))).toEqual(['Code'])
    expect(unmet(vehicleReadiness({ ...van, code: 'VAN-030' }))).toEqual([])
  })
})

const blankSite: SiteInput = {
  name: '',
  city: '',
  manager: '',
  capacityUnits: 0,
  docks: 0,
  zones: [{ name: '', capacity: 0 }],
}

describe('site readiness', () => {
  it('lists what a new site still needs', () => {
    expect(unmet(siteReadiness(blankSite))).toEqual([
      'Named',
      'Manager',
      'Capacity and docks',
      'At least one zone',
    ])
  })

  it('counts a zone once it has a name and a capacity', () => {
    const site = {
      ...blankSite,
      name: 'East Gate',
      manager: 'P. Ruiz',
      capacityUnits: 5000,
      docks: 3,
    }
    expect(unmet(siteReadiness(site))).toEqual(['At least one zone'])
    const zoned = { ...site, zones: [{ name: 'Zone A', capacity: 2500 }] }
    expect(unmet(siteReadiness(zoned))).toEqual([])
  })
})
