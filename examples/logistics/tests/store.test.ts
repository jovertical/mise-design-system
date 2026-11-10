import { beforeEach, describe, expect, it } from 'vitest'

import { SEED } from '../src/modules/core/data/seed/index.js'
import { createStore, STORAGE_KEY } from '../src/modules/core/data/store.svelte.js'

beforeEach(() => localStorage.clear())

describe('the store', () => {
  it('starts from a copy of the seed', () => {
    const store = createStore()

    expect(store.data.orders).toHaveLength(SEED.orders.length)

    store.data.orders.pop()

    expect(SEED.orders).toHaveLength(60)
  })

  it('reads what an earlier visit saved', () => {
    const first = createStore()

    first.data.settings.companyName = 'Renamed'

    first.save()

    expect(createStore().data.settings.companyName).toBe('Renamed')
  })

  it('discards a store saved under another version', () => {
    localStorage.setItem('mise-logistics-demo:v2', JSON.stringify({ orders: [] }))

    expect(createStore().data.orders).toHaveLength(60)
    expect(STORAGE_KEY).toBe('mise-logistics-demo:v3')
  })

  it('ignores a saved store that does not parse', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')

    expect(createStore().data.orders).toHaveLength(60)
  })

  it('resets to the seed and forgets the saved copy', () => {
    const store = createStore()

    store.data.orders = []

    store.save()

    store.reset()

    expect(store.data.orders).toHaveLength(60)
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})
