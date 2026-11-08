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
