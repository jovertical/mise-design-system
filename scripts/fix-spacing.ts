/**
 * `pnpm fix:spacing [paths…]`: puts the blank lines between statements that
 * `.ai/guidelines/clean-code/guide.md` asks for, in every checked file or in
 * those under the given paths. Only blank lines change; run `pnpm format` after.
 */
import { readFileSync, writeFileSync } from 'node:fs'

import { checkedFiles } from './conventions/files.js'
import { fixSpacing } from './conventions/index.js'

const prefixes = process.argv.slice(2).map((path) => path.replace(/^\.\//, '').replace(/\/$/, ''))

const matchesPrefix = (path: string) =>
  prefixes.length === 0 ||
  prefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))

let changed = 0

for (const path of checkedFiles('.').filter(matchesPrefix)) {
  const text = readFileSync(path, 'utf8')
  const fixed = fixSpacing(path, text)

  if (fixed === text) continue

  writeFileSync(path, fixed)

  changed += 1
}

console.log(`${changed} ${changed === 1 ? 'file' : 'files'} respaced`)
