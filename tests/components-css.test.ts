import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

/**
 * components.css is hand-written and nothing else parses it before Storybook
 * or a consumer's Tailwind does. An unclosed comment once swallowed three
 * toast rules and only failed the Storybook build, so the structure is
 * checked here.
 */
const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'lib', 'styles', 'components.css'),
  'utf8',
)

describe('components.css', () => {
  it('closes every comment it opens, in order', () => {
    const tokens = [...css.matchAll(/\/\*|\*\//g)].map((match) => match[0])
    const unbalanced = tokens.some((token, index) => token !== (index % 2 === 0 ? '/*' : '*/'))

    expect(unbalanced).toBe(false)
    expect(tokens.length % 2).toBe(0)
  })

  it('closes every block it opens', () => {
    const code = css.replace(/\/\*[\s\S]*?\*\//g, '')
    let depth = 0

    for (const character of code) {
      if (character === '{') depth++

      if (character === '}') depth--

      expect(depth).toBeGreaterThanOrEqual(0)
    }

    expect(depth).toBe(0)
  })
})
