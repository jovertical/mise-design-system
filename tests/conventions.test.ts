// @vitest-environment node
/**
 * The repository against `.ai/guidelines/clean-code/guide.md`. Exceptions,
 * each with a reason, are in `scripts/conventions/exceptions.ts`.
 * `conventions-breakers.json` lists the files that broke a rule when the
 * check landed. It may only shrink: a listed file that no longer breaks its
 * rule fails here until it is taken off.
 */
import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { isExcepted } from '../scripts/conventions/exceptions.js'
import {
  checkRepository,
  formatViolation,
  type Rule,
  type Violation,
} from '../scripts/conventions/index.js'

const breakers: Record<string, Rule[]> = JSON.parse(
  readFileSync('tests/conventions-breakers.json', 'utf8'),
)

const violations: Violation[] = checkRepository('.')

const isListed = (violation: Violation) =>
  breakers[violation.path]?.includes(violation.rule) ?? false

describe('the clean-code guide', () => {
  it('holds in every file, outside the exceptions and the listed breakers', () => {
    const unexpected = violations.filter(
      (violation) => !isExcepted(violation) && !isListed(violation),
    )

    expect(unexpected.map(formatViolation)).toEqual([])
  })

  it('lists no breaker that has been fixed', () => {
    const stale = Object.entries(breakers).flatMap(([path, rules]) =>
      rules
        .filter(
          (rule) =>
            !violations.some((violation) => violation.path === path && violation.rule === rule),
        )
        .map((rule) => `${path}: ${rule} is fixed; take it off conventions-breakers.json`),
    )

    expect(stale).toEqual([])
  })
})
