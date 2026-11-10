// @vitest-environment node
/**
 * The spacing rule of the clean-code check, and the fixer that applies it, on
 * small inputs.
 */
import { describe, expect, it } from 'vitest'

import { checkFile, fixSpacing } from '../scripts/conventions/index.js'

const found = (path: string, text: string) =>
  checkFile(path, text)
    .filter((violation) => violation.rule === 'spacing')
    .map((violation) => `${violation.line}: ${violation.detail}`)

describe('spacing', () => {
  const spacing = (text: string, path = 'src/lib/a.ts') => found(path, text)

  const compactSave = [
    'function save(values: VehicleInput) {',
    '  if (!vehicle) return',
    '  const saved = updateVehicle(store, vehicle.id, values)',
    '  toast.success(`${saved.code} saved`)',
    "  goto(resolve('/fleet/[id]', { id: saved.code }))",
    '}',
  ].join('\n')

  const spacedSave = [
    'function save(values: VehicleInput) {',
    '  if (!vehicle) return',
    '',
    '  const saved = updateVehicle(store, vehicle.id, values)',
    '',
    '  toast.success(`${saved.code} saved`)',
    '',
    "  goto(resolve('/fleet/[id]', { id: saved.code }))",
    '}',
  ].join('\n')

  const spacedFormats = [
    "const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })",
    '',
    "const compact = new Intl.NumberFormat('en-US', {",
    "  style: 'currency',",
    '  maximumFractionDigits: 1,',
    '})',
    '',
    "const numbers = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })",
    "const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' })",
  ].join('\n')

  it('passes the guide’s examples as written', () => {
    expect(spacing(spacedSave)).toEqual([])

    expect(spacing(spacedFormats)).toEqual([])
  })

  it('asks for a blank line after a guard, between calls and before a different statement', () => {
    expect(spacing(compactSave)).toEqual([
      '3: add a blank line before this statement',
      '4: add a blank line before this statement',
      '5: add a blank line before this statement',
    ])
  })

  it('asks for room around a multi-line statement, even between declarations', () => {
    expect(spacing(spacedFormats.replaceAll('\n\n', '\n'))).toEqual([
      '2: add a blank line before this statement',
      '6: add a blank line before this statement',
    ])
  })

  it('lets single-line declarations and single-line assignments group, but not calls', () => {
    expect(spacing('const first = 1\nlet second = 2\ntype Third = string')).toEqual([])

    expect(spacing('function reset() {\n  values.a = 1\n  values.b += 2\n}')).toEqual([])

    expect(spacing('function run() {\n  start()\n  stop()\n}')).toEqual([
      '3: add a blank line before this statement',
    ])

    expect(spacing('function run() {\n  const value = 1\n  stop(value)\n}')).toEqual([
      '3: add a blank line before this statement',
    ])
  })

  it('lets single-line assertions group, apart from the step before them', () => {
    const assertions = [
      "it('adds', async () => {",
      '  const total = add(1, 2)',
      '',
      '  expect(total).toBe(3)',
      '  expect(total).not.toBe(4)',
      '  await expect(load()).resolves.toBe(1)',
      '})',
    ].join('\n')

    expect(spacing(assertions, 'tests/a.test.ts')).toEqual([])

    expect(
      spacing("it('runs', () => {\n  run()\n  expect(done).toBe(true)\n})", 'tests/a.test.ts'),
    ).toEqual(['3: add a blank line before this statement'])
  })

  it('keeps a comment with the statement below it', () => {
    expect(spacing('const first = 1\n\n// The second one.\nstart()')).toEqual([])

    expect(spacing('const first = 1\n// The second one.\nstart()')).toEqual([
      '2: add a blank line before this statement',
    ])
  })

  it('wants no blank line at the start or end of a block', () => {
    expect(spacing('function run() {\n\n  start()\n\n}')).toEqual([
      '3: remove the blank line above this statement',
      '3: remove the blank line below this statement',
    ])
  })

  it('treats imports and re-exports as one group, however they wrap, and checks after them', () => {
    expect(spacing("import a from 'a'\nimport b from 'b'\n\nstart()")).toEqual([])

    expect(spacing("import {\n  a,\n  b,\n} from 'a'\nimport c from 'c'\n\nstart()")).toEqual([])

    expect(spacing("export { a } from './a'\nexport {\n  b,\n  c,\n} from './b'")).toEqual([])

    expect(spacing("import a from 'a'\nstart()")).toEqual([
      '2: add a blank line before this statement',
    ])
  })

  it('leaves a semicolon Biome moved to the next line with that line', () => {
    const guarded = 'function pick(next: Day) {\n  value = next\n\n  ;(handler as Handler)(next)\n}'

    expect(spacing(guarded)).toEqual([])
    expect(fixSpacing('src/lib/a.ts', guarded)).toBe(guarded)

    const first =
      'function set(name: string, next: string) {\n  ;(values as Record<string, string>)[name] = next\n}'

    expect(spacing(first)).toEqual([])
  })

  it('finds a script whose generics hold a >', () => {
    const text = [
      '<script lang="ts" generics="T extends Record<string, unknown>">',
      '  start()',
      '  stop()',
      '</script>',
    ].join('\n')

    expect(spacing(text, 'src/lib/a.svelte')).toEqual(['3: add a blank line before this statement'])
  })

  it('reports a Svelte script at the file line', () => {
    const text = ['<p>Hello</p>', '<script lang="ts">', '  start()', '  stop()', '</script>'].join(
      '\n',
    )

    expect(spacing(text, 'src/lib/a.svelte')).toEqual(['4: add a blank line before this statement'])
  })
})

describe('the spacing fixer', () => {
  const compact = [
    'function save(values: VehicleInput) {',
    '',
    '  if (!vehicle) return',
    '  const saved = updateVehicle(store, vehicle.id, values) // the stored copy',
    '  toast.success(`${saved.code} saved`)',
    '',
    '}',
    "const dollars = new Intl.NumberFormat('en-US')",
    "const compact = new Intl.NumberFormat('en-US', {",
    "  notation: 'compact',",
    '})',
    "const numbers = new Intl.NumberFormat('en-US')",
    "const day = new Intl.DateTimeFormat('en-GB')",
  ].join('\n')

  const spaced = [
    'function save(values: VehicleInput) {',
    '  if (!vehicle) return',
    '',
    '  const saved = updateVehicle(store, vehicle.id, values) // the stored copy',
    '',
    '  toast.success(`${saved.code} saved`)',
    '}',
    '',
    "const dollars = new Intl.NumberFormat('en-US')",
    '',
    "const compact = new Intl.NumberFormat('en-US', {",
    "  notation: 'compact',",
    '})',
    '',
    "const numbers = new Intl.NumberFormat('en-US')",
    "const day = new Intl.DateTimeFormat('en-GB')",
  ].join('\n')

  it('adds the blank lines the rule asks for and removes the ones it forbids', () => {
    expect(fixSpacing('src/lib/a.ts', compact)).toBe(spaced)
  })

  it('changes nothing on its own output', () => {
    expect(fixSpacing('src/lib/a.ts', spaced)).toBe(spaced)
  })

  it('touches only the scripts of a Svelte file', () => {
    const before = '<script lang="ts">\n  start()\n  stop()\n</script>\n\n<p>One</p>\n<p>Two</p>\n'
    const after = '<script lang="ts">\n  start()\n\n  stop()\n</script>\n\n<p>One</p>\n<p>Two</p>\n'

    expect(fixSpacing('src/lib/a.svelte', before)).toBe(after)
  })
})
