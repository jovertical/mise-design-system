/**
 * The settings repository against the seed. Each test starts from a fresh
 * store, so one test's writes never reach the next.
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { createStore, type Store } from '../src/modules/core/data/store.svelte.js'
import { getSettings, saveSettings } from '../src/modules/settings/data/index.js'

let source: Store

beforeEach(() => {
  localStorage.clear()

  source = createStore()
})

describe('settings', () => {
  it('reads and saves', () => {
    saveSettings(source, { ...getSettings(source), companyName: 'Renamed Co' })

    expect(getSettings(source).companyName).toBe('Renamed Co')
  })
})
