import { beforeEach, describe, expect, it } from 'vitest'

import { createClient } from '../src/modules/clients/data/index.js'
import { clientSchema } from '../src/modules/clients/data/schema.js'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import { createOrder } from '../src/modules/orders/data/index.js'
import { orderSchema } from '../src/modules/orders/data/schema.js'
import { updateProduct } from '../src/modules/products/data/index.js'
import { productSchema } from '../src/modules/products/data/schema.js'
import { getSettings, saveSettings } from '../src/modules/settings/data/index.js'
import { settingsSchema } from '../src/modules/settings/data/schema.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
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
  it('accept a valid order and reject an invalid one', () => {
    expect(orderSchema.safeParse(order).success).toBe(true)
    expect(orderSchema.safeParse({ ...order, total: 12.5 }).success).toBe(false)
    expect(orderSchema.safeParse({ ...order, clientId: '' }).success).toBe(false)

    expect(orderSchema.safeParse({ ...order, total: 0 }).error?.issues[0].message).toBe(
      'Enter the order total',
    )
  })

  it('accept a valid product and reject an invalid one', () => {
    const product = {
      name: 'Stretch film',
      sku: 'PK-0499',
      category: 'packaging' as const,
      unit: 'roll',
      price: 1450,
      reorderPoint: 40,
      openingStock: [{ locationId: 'loc-harbour', onHand: 120 }],
    }

    expect(productSchema.safeParse(product).success).toBe(true)

    expect(productSchema.safeParse({ ...product, price: 0 }).error?.issues[0].message).toBe(
      'Enter a price',
    )

    expect(productSchema.safeParse({ ...product, sku: 'pk 0499' }).error?.issues[0].message).toBe(
      'Capitals, digits and dashes only',
    )

    expect(productSchema.safeParse({ ...product, reorderPoint: -1 }).success).toBe(false)
  })

  it('accept a valid client and reject an invalid one', () => {
    const client = {
      name: 'Pine Deli',
      industry: 'Food',
      contact: 'H. Boyd',
      email: 'boyd@pine.example',
      city: 'Riverside',
      manager: 'Ops manager',
      status: 'active' as const,
    }

    expect(clientSchema.safeParse(client).success).toBe(true)
    expect(clientSchema.safeParse({ ...client, email: 'not-an-email' }).success).toBe(false)

    expect(clientSchema.safeParse({ ...client, manager: ' ' }).error?.issues[0].message).toBe(
      'Name the account manager',
    )

    expect(clientSchema.safeParse({ ...client, status: 'archived' }).success).toBe(false)
  })

  it('accept the saved settings and reject invalid ones', () => {
    expect(settingsSchema.safeParse(getSettings(source)).success).toBe(true)

    expect(
      settingsSchema.safeParse({ ...getSettings(source), timezone: 'Mars/Olympus' }).success,
    ).toBe(false)

    expect(settingsSchema.safeParse({ ...getSettings(source), orderPrefix: 'or 1' }).success).toBe(
      false,
    )

    expect(settingsSchema.safeParse({ ...getSettings(source), website: 'example' }).success).toBe(
      false,
    )
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
    expect(() => createOrder(source, { ...order, destination: 'x' })).toThrow()

    expect(() =>
      updateProduct(source, 'prd-pk-0422', {
        name: 'Corner boards',
        sku: 'PK-0422',
        category: 'packaging',
        unit: 'pack',
        price: 1.5,
        reorderPoint: 1,
        openingStock: [],
      }),
    ).toThrow()

    expect(() =>
      createClient(source, {
        name: 'A',
        industry: '',
        contact: '',
        email: 'x',
        city: '',
        manager: '',
        status: 'active',
      }),
    ).toThrow()

    expect(() => saveSettings(source, { ...getSettings(source), companyName: '' })).toThrow()
    expect(source.data.orders).toHaveLength(60)
  })
})
