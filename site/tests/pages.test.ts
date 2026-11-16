// @vitest-environment node
/**
 * Every page against mise's source: an ApiTable names a component or part
 * mise has, an Anatomy names data-slot values mise renders, and every example
 * a page uses exists. Runs before a build, so a typo fails here first.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { componentDocs } from '../../scripts/skill/component-docs.js'

const repository = join(import.meta.dirname, '..', '..')
const routes = join(import.meta.dirname, '..', 'src', 'routes')
const docs = componentDocs(repository)

const filesNamed = (directory: string, matches: (name: string) => boolean): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) return filesNamed(path, matches)

    return matches(entry.name) ? [path] : []
  })

const slots = new Set(
  filesNamed(join(repository, 'src', 'lib', 'components'), (name) =>
    name.endsWith('.svelte'),
  ).flatMap((file) =>
    [...readFileSync(file, 'utf8').matchAll(/data-slot="([a-z0-9-]+)"/g)].map((match) => match[1]),
  ),
)

const components = new Set(docs.map((doc) => doc.name))
const parts = new Set(docs.flatMap((doc) => doc.parts.map((part) => part.name)))

const pages = filesNamed(routes, (name) => name === '+page.md').map((file) => ({
  file,
  text: readFileSync(file, 'utf8'),
}))

const relative = (file: string) => file.slice(routes.length)

describe('the pages', () => {
  it('name only components and parts mise has', () => {
    const unknown = pages.flatMap(({ file, text }) => [
      ...[...text.matchAll(/<ApiTable component="(\w+)"/g)]
        .filter((match) => !components.has(match[1]))
        .map((match) => `${relative(file)}: component ${match[1]}`),
      ...[...text.matchAll(/<ApiTable part="(\w+)"/g)]
        .filter((match) => !parts.has(match[1]))
        .map((match) => `${relative(file)}: part ${match[1]}`),
    ])

    expect(unknown).toEqual([])
  })

  // A `selector:` part (one a dependency renders without a data-slot) is left
  // to the smoke run, which fails when an anatomy part is not found.
  it('anchor anatomy only on data-slot values mise renders', () => {
    const unknown = pages.flatMap(({ file, text }) =>
      [...text.matchAll(/slot: '([a-z0-9-]+)'/g)]
        .filter((match) => !slots.has(match[1]))
        .map((match) => `${relative(file)}: ${match[1]}`),
    )

    expect(unknown).toEqual([])
  })

  it('use only examples that exist', () => {
    // examples.basic, or examples['with-icon'] for a kebab-case file name.
    const missing = pages.flatMap(({ file, text }) =>
      [...text.matchAll(/examples(?:\.([a-zA-Z0-9]+)|\['([a-z0-9-]+)'\])/g)]
        .map((match) => match[1] ?? match[2])
        .filter((name) => !existsSync(join(dirname(file), 'examples', `${name}.svelte`)))
        .map((name) => `${relative(file)}: examples/${name}.svelte`),
    )

    expect(missing).toEqual([])
  })

  it('give every component page an Anatomy and an ApiTable', () => {
    const incomplete = pages
      .filter(({ file }) => file.includes('/components/'))
      .filter(({ text }) => !text.includes('<Anatomy') || !text.includes('<ApiTable'))
      .map(({ file }) => relative(file))

    expect(incomplete).toEqual([])
  })
})
