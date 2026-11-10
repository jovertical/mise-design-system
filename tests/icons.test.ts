/**
 * mise draws Tabler, as the React package does (2026-11-10, amending D8).
 * Lucide must not come back, and Tabler is imported one icon per file: the
 * package root re-exports every icon and svelte-check would load them all.
 */
import { globSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** Task 5 adds `examples/logistics/src` once the example is moved. */
const SOURCES = globSync([
  'src/**/*.{svelte,ts}',
  'stories/**/*.{svelte,ts}',
  'tests/fixtures/**/*.svelte',
])

const LUCIDE = /from '@lucide\//

/** A value import of the root. `import type { Icon }` from the root is fine: types load nothing. */
const TABLER_ROOT = /^\s*import (?!type )[^;]*?from '@tabler\/icons-svelte-runes'/m

const offendersOf = (pattern: RegExp) =>
  SOURCES.filter((path) => pattern.test(readFileSync(path, 'utf8')))

describe('icons', () => {
  it('never imports Lucide', () => {
    expect(offendersOf(LUCIDE)).toEqual([])
  })

  it('imports Tabler one icon per file, never from the package root', () => {
    expect(offendersOf(TABLER_ROOT)).toEqual([])
  })
})
