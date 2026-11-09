import { beforeEach, describe, expect, it } from 'vitest'

import { createClient } from '../src/lib/data/clients.js'
import { createOrder } from '../src/lib/data/orders.js'
import { updateProduct } from '../src/lib/data/products.js'
import {
  newClientSchema,
  newOrderSchema,
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
  weightKg: 40,
  total: 5600,
}

describe('schemas', () => {
  it('accept valid input and reject invalid input', () => {
    expect(newOrderSchema.safeParse(order).success).toBe(true)
    expect(newOrderSchema.safeParse({ ...order, total: 12.5 }).success).toBe(false)
    expect(newOrderSchema.safeParse({ ...order, weightKg: 0 }).success).toBe(false)
    expect(newOrderSchema.safeParse({ ...order, clientId: '' }).success).toBe(false)

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
