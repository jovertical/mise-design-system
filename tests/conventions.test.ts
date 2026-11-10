// @vitest-environment node
/**
 * The repository against `.ai/guidelines/clean-code/guide.md`: every `.ts`
 * and `.svelte` file in mise and the examples. Exceptions, each with its
 * reason, are in `scripts/conventions/exceptions.ts`; nothing else may break
 * a rule.
 */
import { describe, expect, it } from 'vitest'

import { isExcepted } from '../scripts/conventions/exceptions.js'
import { checkRepository, formatViolation } from '../scripts/conventions/index.js'

describe('the clean-code guide', () => {
  // It parses every file in the repository, which runs near the default 5s
  // under a loaded machine and timed out twice; the work is fixed, so the
  // limit is raised rather than the check split.
  it('holds in every file, outside the declared exceptions', { timeout: 20_000 }, () => {
    const violations = checkRepository('.').filter((violation) => !isExcepted(violation))

    expect(violations.map(formatViolation)).toEqual([])
  })
})
