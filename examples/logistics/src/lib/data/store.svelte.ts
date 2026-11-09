/**
 * Every collection the demo has, in one $state object. Read once from
 * localStorage (or copied from the seed), written back by save(), which the
 * layout calls from a debounced $effect. The key carries SEED_VERSION, so a
 * visitor's store from an older seed shape is ignored, not misread.
 */
import { SEED, SEED_VERSION } from './seed/index.js'
import type { Dataset } from './types.js'

export const STORAGE_KEY = `mise-logistics-demo:v${SEED_VERSION}`

const copy = <T>(value: T): T => structuredClone(value)

function load(): Dataset {
  try {
    const saved = globalThis.localStorage?.getItem(STORAGE_KEY)
    return saved ? (JSON.parse(saved) as Dataset) : copy(SEED)
  } catch {
    return copy(SEED)
  }
}

export function createStore() {
  const state = $state({ data: load() })
  return {
    get data() {
      return state.data
    },
    set data(next: Dataset) {
      state.data = next
    },
    save() {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify($state.snapshot(state.data)))
    },
    reset() {
      state.data = copy(SEED)
      globalThis.localStorage?.removeItem(STORAGE_KEY)
    },
  }
}

export type Store = ReturnType<typeof createStore>

/** The app's one store. Tests create their own. */
export const store = createStore()
