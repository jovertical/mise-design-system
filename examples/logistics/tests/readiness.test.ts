import { describe, expect, it } from 'vitest'

import { clientReadiness, orderReadiness } from '../src/lib/data/readiness.js'
import type { ClientInput, OrderInput } from '../src/lib/data/schemas.js'

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
