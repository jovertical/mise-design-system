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
  it('holds in every file, outside the declared exceptions', () => {
    const violations = checkRepository('.').filter((violation) => !isExcepted(violation))

    expect(violations.map(formatViolation)).toEqual([])
  })
})
