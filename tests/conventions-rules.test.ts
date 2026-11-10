// @vitest-environment node
/**
 * The names, size and non-null rules of the clean-code check on small inputs,
 * so a change to the checker shows here before it shows on the whole
 * repository. Spacing has its own file, `conventions-spacing.test.ts`.
 */
import { describe, expect, it } from 'vitest'

import { checkFile, type Rule } from '../scripts/conventions/index.js'

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
      "import IconX from '@tabler/icons-svelte-runes/icons/x'",
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
