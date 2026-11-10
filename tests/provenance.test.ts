import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { componentFolders, componentsDir as components } from './groups.js'

/**
 * A provenance header is only useful if it is true, and nobody checks a header
 * by hand. The `Origin:` line names the React file each module was ported
 * from, or says `mise` for a component mise authored itself. The story's
 * `tags` project the same fact into the Storybook sidebar (`shadcn` when that
 * React file descends from shadcn/ui, `mise` otherwise), and are checked
 * against the header.
 *
 * Ported from the React package 2.23.0 tests/provenance.test.ts.
 */

const folders = componentFolders()

const isStory = (name: string) => name.endsWith('.stories.svelte')

const isModule = (name: string) =>
  (name.endsWith('.svelte') || name.endsWith('.ts')) && !isStory(name) && name !== 'index.ts'

const modules = folders
  .flatMap(({ path }) =>
    readdirSync(join(components, path))
      .filter(isModule)
      .map((name) => `${path}/${name}`),
  )
  .sort()

const read = (path: string) => readFileSync(join(components, path), 'utf8')

/** The opening comment: `<!-- … -->` in a .svelte file, a JSDoc block in a .ts file. */
function header(path: string): string | null {
  const pattern = path.endsWith('.svelte') ? /^<!--([\s\S]*?)-->/ : /^\/\*\*([\s\S]*?)\*\//

  return read(path).match(pattern)?.[1] ?? null
}

function field(path: string, key: string): string | null {
  const match = (header(path) ?? '').match(new RegExp(`^[\\s*]*${key}:\\s*(.+)$`, 'm'))

  return match ? match[1].trim() : null
}

/**
 * A module either names the React file it was ported from, or says `mise`: a
 * component mise authored itself, with no React origin (Board, 2026-11-09).
 */
const ORIGIN = /^(the React package 2\.23\.0 `[a-z-]+\.tsx?`|mise$)/
const SVELTE = /^shadcn-svelte `[a-z-]+`/

const provenanceOf = (path: string) =>
  field(path, 'Origin')?.includes('shadcn/ui') ? 'shadcn' : 'mise'

describe('Origin headers', () => {
  it('opens every component module with a header comment', () => {
    expect(modules.filter((path) => header(path) === null)).toEqual([])
  })

  it('names the React file each module was ported from, or mise', () => {
    expect(modules.filter((path) => !ORIGIN.test(field(path, 'Origin') ?? ''))).toEqual([])
  })

  it('records a Diverged line in every module, "none" included', () => {
    expect(modules.filter((path) => field(path, 'Diverged') === null)).toEqual([])
  })

  it('names a shadcn-svelte component wherever a Svelte line is present', () => {
    const wrong = modules.filter((path) => {
      const value = field(path, 'Svelte')

      return value !== null && !SVELTE.test(value)
    })

    expect(wrong).toEqual([])
  })
})

describe('Storybook tags', () => {
  it("tags every component folder's story with its provenance, and nothing else", () => {
    const wrong = folders.flatMap(({ name, path }) => {
      const story = `${path}/${name}.stories.svelte`

      if (!existsSync(join(components, story))) return [`${story} is missing`]

      const list = read(story).match(/tags:\s*\[([^\]]*)\]/)?.[1] ?? ''
      const tags = [...list.matchAll(/'([^']+)'/g)].map((match) => match[1])
      const expected = provenanceOf(`${path}/${name}.svelte`)

      return tags.length === 1 && tags[0] === expected
        ? []
        : [`${story} should be tagged only '${expected}'`]
    })

    expect(wrong).toEqual([])
  })
})
