// @vitest-environment node
/**
 * Every component page's sub-group, traits and keywords: the sidebar, the
 * overview's filters and search read them, so a typo here would put a page in
 * no sub-group or split one filter into two.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { SUB_GROUPS } from '../src/modules/nav/data/navigation.js'
import { TRAITS } from '../src/modules/nav/data/traits.js'

const components = join(import.meta.dirname, '..', 'src', 'routes', 'components')

type Frontmatter = Record<string, string | string[]>

/** The block between the first two `---` lines: `key: value` or `key: [a, b]`. */
function frontmatterOf(text: string): Frontmatter {
  const block = text.split('\n---\n')[0].replace(/^---\n/, '')

  return Object.fromEntries(
    block.split('\n').map((line) => {
      const [key, ...rest] = line.split(': ')
      const value = rest.join(': ')
      const list = value.match(/^\[(.*)\]$/)

      return [key, list ? list[1].split(', ').filter(Boolean) : value]
    }),
  )
}

const pages = readdirSync(components).flatMap((section) =>
  readdirSync(join(components, section)).map((folder) => {
    const file = join(section, folder, '+page.md')

    return { file, meta: frontmatterOf(readFileSync(join(components, file), 'utf8')) }
  }),
)

const listOf = (value: string | string[] | undefined) => (Array.isArray(value) ? value : [])

describe('component page metadata', () => {
  it('puts a page in one of its section’s sub-groups, exactly where the section has them', () => {
    const wrong = pages
      .filter(({ meta }) => {
        const groups = SUB_GROUPS[meta.section as string]

        if (!groups) return meta.group !== undefined

        return !groups.includes(meta.group as string)
      })
      .map(({ file, meta }) => `${file}: ${meta.group ?? 'no group'}`)

    expect(wrong).toEqual([])
  })

  it('gives every sub-group a page', () => {
    const empty = Object.entries(SUB_GROUPS).flatMap(([section, groups]) =>
      groups
        .filter(
          (group) => !pages.some(({ meta }) => meta.section === section && meta.group === group),
        )
        .map((group) => `${section}: ${group}`),
    )

    expect(empty).toEqual([])
  })

  it('uses only traits from the vocabulary', () => {
    const vocabulary: readonly string[] = TRAITS

    const unknown = pages.flatMap(({ file, meta }) =>
      listOf(meta.traits)
        .filter((trait) => !vocabulary.includes(trait))
        .map((trait) => `${file}: ${trait}`),
    )

    expect(unknown).toEqual([])
  })

  it('writes keywords in lowercase', () => {
    const shouting = pages.flatMap(({ file, meta }) =>
      listOf(meta.keywords)
        .filter((keyword) => keyword !== keyword.toLowerCase())
        .map((keyword) => `${file}: ${keyword}`),
    )

    expect(shouting).toEqual([])
  })
})
