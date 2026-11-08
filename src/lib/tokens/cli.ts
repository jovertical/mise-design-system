import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import type { ThemeConfig } from './config.js'
import { themeStylesheet } from './emit-web.js'

const USAGE = 'Usage: mise-theme <config> -o <output.css>'

/**
 * A path rather than a `new URL(…)`, because a global `URL` that is not
 * Node's (jsdom's, in a test) is rejected by `fs`.
 */
const COMPONENTS_CSS = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'styles',
  'components.css',
)

export interface CliResult {
  code: number
  message: string
}

/**
 * Turns a consumer's `mise.theme.js` into a full replacement for `theme.css`
 * (spec, Theming level 3). The component overrides ship next to this file in
 * `dist/styles/`, so the output matches the packaged stylesheet line for line,
 * apart from the theme.
 */
export async function runThemeCli(argv: string[], cwd = process.cwd()): Promise<CliResult> {
  const [configPath, flag, outputPath] = argv
  if (!configPath || flag !== '-o' || !outputPath) return { code: 1, message: USAGE }

  try {
    const module = await import(pathToFileURL(resolve(cwd, configPath)).href)
    const config: ThemeConfig | undefined = module.default
    if (!config || typeof config !== 'object') {
      return { code: 1, message: `${configPath} has no default export.` }
    }

    const overrides = await readFile(COMPONENTS_CSS, 'utf8')
    const css = themeStylesheet(config, overrides)
    const target = resolve(cwd, outputPath)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, css)

    return { code: 0, message: `${outputPath}: ${css.split('\n').length} lines` }
  } catch (error) {
    return { code: 1, message: error instanceof Error ? error.message : String(error) }
  }
}
