/**
 * Writes dist/theme.css: the default theme followed by the component overrides.
 * One artifact means one line in a consumer's stylesheet.
 *
 * Adapted from the React package 2.23.0 scripts/build-theme.ts.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { themeStylesheet } from '../src/lib/tokens/emit-web.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const overrides = readFileSync(join(root, 'src/lib/styles/components.css'), 'utf8')
const css = themeStylesheet({}, overrides)

mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(join(root, 'dist/theme.css'), css)

console.log(`dist/theme.css: ${css.split('\n').length} lines`)
