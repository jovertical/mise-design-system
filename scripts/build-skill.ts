/**
 * Writes skills/mise/components/<group>.md from the components' Props types.
 * Run after changing a Props type or its JSDoc; tests/skill.test.ts fails
 * until the committed catalogue matches.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { catalogue, skillDir } from './skill/catalogue.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const target = join(skillDir(root), 'components')

mkdirSync(target, { recursive: true })
for (const stale of readdirSync(target)) rmSync(join(target, stale))
for (const [group, markdown] of catalogue(root)) {
  writeFileSync(join(target, `${group}.md`), markdown)
  console.log(`skills/mise/components/${group}.md: ${markdown.split('\n').length} lines`)
}
