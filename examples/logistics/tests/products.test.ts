/**
 * The products repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import {
  createProduct,
  listProducts,
  lowStock,
  productStock,
  productToInput,
  updateProduct,
} from '../src/modules/products/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('products', () => {
  it('sums stock across locations', () => {
    const wrap = listProducts(source, { search: 'PK-0410' })[0]

    expect(productStock(wrap)).toEqual({ onHand: 1240, reserved: 310, available: 930 })
  })

  it('finds the products below their reorder point', () => {
    expect(
      lowStock(source)
        .map((product) => product.sku)
        .sort(),
    ).toEqual(['CC-3008', 'PK-0422', 'PK-0462', 'PL-1020'])
  })

  it('updates a product and leaves its stock alone', () => {
    const corner = listProducts(source, { search: 'PK-0422' })[0]
    const stock = JSON.parse(JSON.stringify(corner.stock))

    const product = updateProduct(source, corner.id, {
      ...productToInput(corner),
      name: 'Corner boards ×100',
      price: 990,
      reorderPoint: 80,
      openingStock: [{ locationId: 'loc-riverside', onHand: 9999 }],
    })

    expect(product).toMatchObject({ name: 'Corner boards ×100', price: 990, reorderPoint: 80 })
    expect(product.stock).toEqual(stock)
  })

  it('creates a product with opening stock at every site', () => {
    const product = createProduct(source, {
      name: 'Stretch film, 23µm',
      sku: 'PK-0499',
      category: 'packaging',
      unit: 'roll',
      price: 1450,
      reorderPoint: 40,
      openingStock: [{ locationId: 'loc-harbour', onHand: 120 }],
    })

    expect(product.id).toBe('prd-pk-0499')
    expect(product.stock).toHaveLength(source.data.locations.length)

    expect(product.stock.find((row) => row.locationId === 'loc-harbour')).toEqual({
      locationId: 'loc-harbour',
      onHand: 120,
      reserved: 0,
    })

    expect(productStock(product).onHand).toBe(120)
  })

  it('refuses a SKU another product already has', () => {
    const corner = listProducts(source, { search: 'PK-0422' })[0]
    const wrap = listProducts(source, { search: 'PK-0410' })[0]

    expect(() => createProduct(source, { ...productToInput(corner), name: 'Copy' })).toThrow(
      'SKU PK-0422 is already in use',
    )

    expect(() =>
      updateProduct(source, wrap.id, { ...productToInput(wrap), sku: 'PK-0422' }),
    ).toThrow('SKU PK-0422 is already in use')

    expect(updateProduct(source, corner.id, productToInput(corner)).sku).toBe('PK-0422')
  })
})
