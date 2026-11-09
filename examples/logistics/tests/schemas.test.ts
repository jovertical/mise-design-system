import { beforeEach, describe, expect, it } from 'vitest'

import { createClient } from '../src/lib/data/clients.js'
import { createOrder } from '../src/lib/data/orders.js'
import { updateProduct } from '../src/lib/data/products.js'
import {
  newClientSchema,
  orderSchema,
  productPatchSchema,
  settingsSchema,
} from '../src/lib/data/schemas.js'
import { getSettings, saveSettings } from '../src/lib/data/settings.js'
import { createStore, type Store } from '../src/lib/data/store.svelte.js'

let s: Store
beforeEach(() => {
  localStorage.clear()
  s = createStore()
})

const order = {
  clientId: 'cli-coastal-grocers',
  service: 'regular' as const,
  originId: 'loc-riverside',
  destination: '12 Dock Rd',
  packages: [{ contents: 'Crates', weightKg: 40 }],
  total: 5600,
}

describe('schemas', () => {
  it('accept valid input and reject invalid input', () => {
    expect(orderSchema.safeParse(order).success).toBe(true)
    expect(orderSchema.safeParse({ ...order, total: 12.5 }).success).toBe(false)
    expect(orderSchema.safeParse({ ...order, clientId: '' }).success).toBe(false)
    expect(orderSchema.safeParse({ ...order, total: 0 }).error?.issues[0].message).toBe(
      'Enter the order total',
    )

    expect(productPatchSchema.safeParse({ price: 990, reorderPoint: 80 }).success).toBe(true)
    expect(productPatchSchema.safeParse({ price: -1, reorderPoint: 80 }).success).toBe(false)

    const client = {
      name: 'Pine Deli',
      industry: 'Food',
      contact: 'H. Boyd',
      email: 'boyd@pine.example',
      city: 'Riverside',
    }
    expect(newClientSchema.safeParse(client).success).toBe(true)
    expect(newClientSchema.safeParse({ ...client, email: 'not-an-email' }).success).toBe(false)

    expect(settingsSchema.safeParse(getSettings(s)).success).toBe(true)
    expect(settingsSchema.safeParse({ ...getSettings(s), timezone: 'Mars/Olympus' }).success).toBe(
      false,
    )
    expect(settingsSchema.safeParse({ ...getSettings(s), orderPrefix: 'or 1' }).success).toBe(false)
    expect(settingsSchema.safeParse({ ...getSettings(s), website: 'example' }).success).toBe(false)
  })

  it('want at least one package, each with contents and a weight', () => {
    const issue = (input: unknown) => orderSchema.safeParse(input).error?.issues[0]
    expect(issue({ ...order, packages: [] })?.message).toBe('Add a package')
    expect(issue({ ...order, packages: [{ contents: 'Crates', weightKg: 0 }] })).toMatchObject({
      path: ['packages', 0, 'weightKg'],
      message: 'Enter a weight',
    })
    expect(issue({ ...order, packages: [{ contents: ' ', weightKg: 3 }] })?.message).toBe(
      'Say what is in it',
    )
    const two = [
      { contents: 'Crates', weightKg: 40 },
      { contents: 'Pallet wrap', weightKg: 12.5 },
    ]
    expect(orderSchema.safeParse({ ...order, packages: two }).success).toBe(true)
  })

  it('guard every write function', () => {
    expect(() => createOrder(s, { ...order, destination: 'x' })).toThrow()
    expect(() => updateProduct(s, 'prd-pk-0422', { price: 1.5, reorderPoint: 1 })).toThrow()
    expect(() =>
      createClient(s, { name: 'A', industry: '', contact: '', email: 'x', city: '' }),
    ).toThrow()
    expect(() => saveSettings(s, { ...getSettings(s), companyName: '' })).toThrow()
    expect(s.data.orders).toHaveLength(60)
  })
})
