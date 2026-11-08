import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  componentFolders,
  componentsDir as components,
  GROUPS,
  groupFolders,
  pascal,
} from './groups.js'

/**
 * addon-svelte-csf renders a `<Story>`'s children *inside* the meta
 * `component` unless the story says `asChild`. Every static story in round 1
 * was drawn that way: the ghost Card inside a default Card, the Destructive
 * buttons inside a solid primary Button, and the Dialog stories inside a
 * DialogContent with no Dialog, which renders nothing. So a story either
 * renders through `{#snippet template(args)}` or carries `asChild`.
 */

const storyFiles = componentFolders().flatMap(({ path }) =>
  readdirSync(join(components, path))
    .filter((name) => name.endsWith('.stories.svelte'))
    .map((name) => join(path, name)),
)

describe('component stories', () => {
  it('render their markup as is, never inside the meta component', () => {
    const wrapped = storyFiles.flatMap((file) => {
      const source = readFileSync(join(components, file), 'utf8')
      return [...source.matchAll(/<Story\b([^>]*)>\s*(\S{0,20})/g)]
        .filter(([, attributes, next]) => !/\basChild\b/.test(attributes) && next !== '{#snippet')
        .map(([, attributes]) => `${file}: <Story${attributes}>`)
    })
    expect(wrapped).toEqual([])
  })

  it('keeps every component folder inside a known group', () => {
    expect(groupFolders().filter((group) => !(group in GROUPS))).toEqual([])
  })

  it('titles each story by its folder: the group, then the component', () => {
    const wrong = componentFolders().flatMap(({ group, name, path }) => {
      const story = join(path, `${name}.stories.svelte`)
      const title = readFileSync(join(components, story), 'utf8').match(/title:\s*'([^']+)'/)?.[1]
      const expected = `${GROUPS[group as keyof typeof GROUPS]}/${pascal(name)}`
      return title === expected ? [] : [`${story}: '${title}', expected '${expected}'`]
    })
    expect(wrong).toEqual([])
  })
})

const AXES = [
  'Variants',
  'Sizes',
  'Tones',
  'Shapes',
  'Sides',
  'Types',
  'Weights',
  'Orientations',
  'Themes',
  'Thicknesses',
  'Surfaces',
  'Densities',
  'Formats',
]
const BANNED = ['Default', 'Basic', 'Plain', 'Small']

/**
 * The skeleton's rank for a story name (docs/specs/2026-11-05-story-skeleton-design.md).
 * Ranks never go down through a file, so scenarios (rank 8) come last.
 */
function rank(name: string): number {
  if (name === 'Playground') return 1
  if (name === 'Matrix') return 2
  if (AXES.includes(name)) return 3
  if (name === 'States') return 4
  if (name.startsWith('With ')) return 5
  if (name === 'Long content') return 6
  if (/^(In|On) /.test(name)) return 7
  return 8
}

const storiesIn = (source: string) =>
  [...source.matchAll(/(-->\s*)?<Story\s+name="([^"]+)"/g)].map(([, comment, name]) => ({
    name,
    commented: comment !== undefined,
  }))

describe('the story skeleton', () => {
  const files = storyFiles
  const read = (file: string) => readFileSync(join(components, file), 'utf8')

  it('opens every file with a Playground', () => {
    const wrong = files.filter((file) => storiesIn(read(file))[0]?.name !== 'Playground')
    expect(wrong).toEqual([])
  })

  it('uses no banned name', () => {
    const wrong = files.flatMap((file) =>
      storiesIn(read(file))
        .filter(({ name }) => BANNED.includes(name))
        .map(({ name }) => `${file}: ${name}`),
    )
    expect(wrong).toEqual([])
  })

  it('keeps the skeleton order, scenarios last', () => {
    const wrong = files.filter((file) => {
      const ranks = storiesIn(read(file)).map(({ name }) => rank(name))
      return ranks.some((value, index) => index > 0 && value < ranks[index - 1])
    })
    expect(wrong).toEqual([])
  })

  it('draws a Matrix with StoryMatrix', () => {
    const wrong = files.filter((file) => {
      const source = read(file)
      return /<Story\s+name="Matrix"/.test(source) && !source.includes('story-matrix.svelte')
    })
    expect(wrong).toEqual([])
  })

  it('explains every story after the Playground in a comment', () => {
    const wrong = files.flatMap((file) =>
      storiesIn(read(file))
        .slice(1)
        .filter(({ commented }) => !commented)
        .map(({ name }) => `${file}: ${name}`),
    )
    expect(wrong).toEqual([])
  })
})
