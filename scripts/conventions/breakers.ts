/**
 * Writes the files that break the clean-code guide today, outside the
 * exceptions, to `tests/conventions-breakers.json`, the list
 * `tests/conventions.test.ts` allows. Run once when the check lands:
 * `pnpm tsx scripts/conventions/breakers.ts`. After that the list only shrinks.
 */
import { writeFileSync } from 'node:fs'

import { isExcepted } from './exceptions.js'
import { checkRepository, type Rule } from './index.js'

export const BREAKERS_PATH = 'tests/conventions-breakers.json'

const breakers: Record<string, Rule[]> = {}

for (const violation of checkRepository('.').filter((candidate) => !isExcepted(candidate))) {
  const rules = breakers[violation.path] ?? []

  if (!rules.includes(violation.rule)) rules.push(violation.rule)

  breakers[violation.path] = rules.toSorted()
}

writeFileSync(BREAKERS_PATH, `${JSON.stringify(breakers, null, 2)}\n`)

console.log(`${Object.keys(breakers).length} files written to ${BREAKERS_PATH}`)
