import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { runThemeCli } from '../src/lib/tokens/cli.js'
import { tailwindPalette } from '../src/lib/tokens/tailwind-palette.js'

/**
 * Inside the repository rather than the OS temp dir: Vitest's module runner
 * only loads a config the CLI imports when the file sits under the project
 * root. `.tmp/` is git-ignored.
 */
const scratch = join(dirname(fileURLToPath(import.meta.url)), '..', '.tmp')

let dir: string

beforeEach(() => {
  mkdirSync(scratch, { recursive: true })

  dir = mkdtempSync(join(scratch, 'mise-theme-'))

  writeFileSync(join(dir, 'package.json'), '{ "type": "module" }')
})

afterEach(() => {
  rmSync(dir, { recursive: true, force: true })
})

describe('mise-theme', () => {
  it('writes a full theme.css replacement from a config file', async () => {
    writeFileSync(join(dir, 'mise.theme.js'), "export default { base: 'stone', primary: 'teal' }")

    const result = await runThemeCli(['mise.theme.js', '-o', 'src/mise-theme.css'], dir)

    expect(result.code).toBe(0)

    const css = readFileSync(join(dir, 'src', 'mise-theme.css'), 'utf8')

    expect(css).toContain(`--color-primary-600: ${tailwindPalette.teal[600]};`)
    expect(css).toContain('@theme inline {')
    expect(css).toContain("[data-slot='button'][aria-disabled='true']")
  })

  it('prints usage when the arguments are incomplete', async () => {
    const result = await runThemeCli(['mise.theme.js'], dir)

    expect(result.code).toBe(1)
    expect(result.message).toMatch(/^Usage: mise-theme <config> -o <output.css>/)
  })

  it('reports a config without a default export', async () => {
    writeFileSync(join(dir, 'empty.js'), 'export const theme = {}')

    const result = await runThemeCli(['empty.js', '-o', 'out.css'], dir)

    expect(result).toEqual({ code: 1, message: 'empty.js has no default export.' })
  })

  it('reports an invalid config instead of throwing', async () => {
    writeFileSync(join(dir, 'bad.js'), "export default { primary: 'chartreuse' }")

    const result = await runThemeCli(['bad.js', '-o', 'out.css'], dir)

    expect(result.code).toBe(1)
    expect(result.message).toContain('Unknown hue "chartreuse" for primary')
  })
})

describe('mise-theme info', () => {
  const app = (dependencies: Record<string, string>) =>
    writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', dependencies }))

  it('reports an Inertia app with its theme config and stylesheet', async () => {
    app({ '@inertiajs/svelte': '^2.0.0', svelte: '^5.41.0', tailwindcss: '^4.1.3' })

    writeFileSync(join(dir, 'mise.theme.js'), 'export default {}')

    mkdirSync(join(dir, 'resources', 'css'), { recursive: true })

    writeFileSync(
      join(dir, 'resources', 'css', 'app.css'),
      "@import 'tailwindcss';\n@import '@jovertical/mise-design-system/theme.css';\n",
    )

    const result = await runThemeCli(['info', '--json'], dir, '1.0.0')

    expect(result.code).toBe(0)

    expect(JSON.parse(result.message)).toEqual({
      version: '1.0.0',
      stack: 'inertia',
      svelte: '^5.41.0',
      tailwind: '^4.1.3',
      themeConfig: 'mise.theme.js',
      stylesheet: 'resources/css/app.css',
      form: false,
    })
  })

  it('reports a SvelteKit app with the form peers and no theme or stylesheet', async () => {
    app({ '@sveltejs/kit': '^3.0.0', formsnap: '^2.0.0', 'sveltekit-superforms': '^2.0.0' })

    const info = JSON.parse((await runThemeCli(['info', '--json'], dir, '1.0.0')).message)

    expect(info).toMatchObject({
      stack: 'sveltekit',
      themeConfig: null,
      stylesheet: null,
      form: true,
    })
  })

  it('calls anything else a plain Vite app', async () => {
    app({ svelte: '^5.0.0' })

    const info = JSON.parse((await runThemeCli(['info', '--json'], dir, '1.0.0')).message)

    expect(info.stack).toBe('vite')
  })

  it('finds the stylesheet of an app on a generated theme, by its @source line', async () => {
    app({ '@inertiajs/svelte': '^2.0.0', svelte: '^5.41.0' })

    mkdirSync(join(dir, 'resources', 'css'), { recursive: true })

    writeFileSync(
      join(dir, 'resources', 'css', 'app.css'),
      "@import 'tailwindcss';\n@import './mise-theme.css';\n@source '../../node_modules/@jovertical/mise-design-system/dist';\n",
    )

    const info = JSON.parse((await runThemeCli(['info', '--json'], dir, '1.0.0')).message)

    expect(info.stylesheet).toBe('resources/css/app.css')
  })

  it('names the command an app regenerates its theme with', async () => {
    writeFileSync(join(dir, 'mise.theme.js'), 'export default {}')

    await runThemeCli(['mise.theme.js', '-o', 'out.css'], dir, '1.0.0')

    const header = readFileSync(join(dir, 'out.css'), 'utf8').split('\n').slice(0, 3).join('\n')

    expect(header).toContain('mise-theme <config> -o <file>')
    expect(header).not.toContain('pnpm build:theme')
  })

  it('skips node_modules when looking for the stylesheet', async () => {
    app({ svelte: '^5.0.0' })

    mkdirSync(join(dir, 'node_modules', 'x'), { recursive: true })

    writeFileSync(
      join(dir, 'node_modules', 'x', 'a.css'),
      "@import '@jovertical/mise-design-system/theme.css';",
    )

    const info = JSON.parse((await runThemeCli(['info', '--json'], dir, '1.0.0')).message)

    expect(info.stylesheet).toBeNull()
  })

  it('prints lines without --json', async () => {
    app({ svelte: '^5.0.0' })

    const result = await runThemeCli(['info'], dir, '1.0.0')

    expect(result.code).toBe(0)
    expect(result.message).toContain('stack: vite')
  })

  it('fails without a package.json', async () => {
    rmSync(join(dir, 'package.json'))

    const result = await runThemeCli(['info', '--json'], dir, '1.0.0')

    expect(result.code).toBe(1)
    expect(result.message).toMatch(/No package.json/)
  })
})
