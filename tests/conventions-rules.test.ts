// @vitest-environment node
/**
 * Each rule of the clean-code check on small inputs, so a change to the
 * checker shows here before it shows on the whole repository.
 */
import { describe, expect, it } from 'vitest'

import { checkFile, fixSpacing, type Rule } from '../scripts/conventions/index.js'

const found = (path: string, text: string, rule: Rule) =>
  checkFile(path, text)
    .filter((violation) => violation.rule === rule)
    .map((violation) => `${violation.line}: ${violation.detail}`)

const names = (text: string, path = 'src/lib/example.ts') =>
  checkFile(path, text)
    .filter((violation) => violation.rule === 'names')
    .map((violation) => violation.detail.split('"')[1])

const lines = (count: number) =>
  Array.from({ length: count }, (_, index) => `const value${index} = 1`).join('\n')

describe('names', () => {
  it('reports a short or abbreviated name wherever one is declared', () => {
    expect(names('const late = list.sort((a, b) => a - b)')).toEqual(['a', 'b'])

    expect(names('try { run() } catch (e) { log(e) }')).toEqual(['e'])

    expect(names('const { class: c } = props')).toEqual(['c'])

    expect(names('for (const i of list) log(i)')).toEqual(['i'])

    expect(names('function format(pkg: Item) { return pkg }')).toEqual(['pkg'])

    expect(names('const [first, cfg] = pair')).toEqual(['cfg'])
  })

  it('allows descriptive names, the allowances and imports', () => {
    const text = [
      "import X from '@lucide/svelte/icons/x'",
      'const point = (x: number, y: number) => ({ x, y })',
      'function pick<T>(items: T[], index: number, _unused: string) { return items[index] }',
      'const handler = (event: Event, args: unknown, id: string, ref: unknown) => event',
    ].join('\n')

    expect(names(text)).toEqual([])
  })

  it('reports names declared in a Svelte template, at the file line', () => {
    const text = [
      '<script lang="ts">',
      '  let { orders } = $props()',
      '</script>',
      '',
      '{#each orders as o, i (o.id)}',
      '  {@const t = o.total}',
      '  <p>{t}</p>',
      '{/each}',
      '{#snippet row(r: string)}',
      '  <button onclick={(e) => log(e)}>{r}</button>',
      '{/snippet}',
      '{#snippet children({ props })}<input {...props} />{/snippet}',
      '{#each orders as _, index (index)}<span>{index}</span>{/each}',
    ].join('\n')

    expect(found('src/lib/list.svelte', text, 'names')).toEqual([
      '5: "o" is too short or abbreviated',
      '5: "i" is too short or abbreviated',
      '6: "t" is too short or abbreviated',
      '9: "r" is too short or abbreviated',
      '10: "e" is too short or abbreviated',
    ])
  })
})

describe('size', () => {
  it('reports a file over its limit once, at line 1', () => {
    expect(found('src/lib/long.ts', lines(301), 'file-length')).toEqual(['1: 301 lines, over 300'])

    expect(found('src/lib/fine.ts', lines(300), 'file-length')).toEqual([])

    const svelte = `<script lang="ts">\n${lines(249)}\n</script>`

    expect(found('src/lib/long.svelte', svelte, 'file-length')).toEqual(['1: 251 lines, over 250'])
  })

  it('reports a function over 40 lines at its first line', () => {
    const body = (count: number) => Array.from({ length: count }, () => '  run()').join('\n')

    expect(
      found('src/lib/a.ts', `const long = () => {\n${body(39)}\n}`, 'function-length'),
    ).toEqual(['1: 41 lines, over 40'])

    expect(
      found('src/lib/a.ts', `const fine = () => {\n${body(38)}\n}`, 'function-length'),
    ).toEqual([])
  })

  it('does not measure a describe block, only what it holds', () => {
    const calls = Array.from({ length: 60 }, () => '  run()').join('\n')
    const suite = `describe('suite', () => {\n${calls}\n})`

    expect(found('tests/a.test.ts', suite, 'function-length')).toEqual([])
  })
})

describe('non-null assertions', () => {
  it('reports one outside tests and allows it in tests', () => {
    expect(found('src/lib/a.ts', 'const size = value!.length', 'non-null')).toHaveLength(1)

    expect(found('tests/a.test.ts', 'const size = value!.length', 'non-null')).toEqual([])

    expect(
      found('examples/demo/tests/a.test.ts', 'const size = value!.length', 'non-null'),
    ).toEqual([])
  })
})

describe('spacing', () => {
  const spacing = (text: string, path = 'src/lib/a.ts') => found(path, text, 'spacing')

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
