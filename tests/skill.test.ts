import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { catalogue, skillDir } from '../scripts/skill/catalogue.js'
import { folderExports } from '../scripts/skill/exports.js'
import { componentFolders, componentsDir } from './groups.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const skill = skillDir(root)
const generated = catalogue(root)

describe('the generated catalogue', () => {
  it('matches the committed files; run pnpm build:skill if not', () => {
    const committed = readdirSync(join(skill, 'components')).sort()

    expect(committed).toEqual([...generated.keys()].map((group) => `${group}.md`).sort())

    for (const [group, markdown] of generated) {
      expect(readFileSync(join(skill, 'components', `${group}.md`), 'utf8')).toBe(markdown)
    }
  })

  it('names every runtime export of every component folder', () => {
    const text = [...generated.values()].join('\n')

    const missing = componentFolders().flatMap(({ path }) =>
      folderExports(readFileSync(join(componentsDir, path, 'index.ts'), 'utf8'))
        .filter((entry) => !entry.typeOnly && !new RegExp(`\\b${entry.name}\\b`).test(text))
        .map((entry) => `${path}: ${entry.name}`),
    )

    expect(missing).toEqual([])
  })
})

const markdownFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((dirent) =>
    dirent.isDirectory()
      ? markdownFiles(join(dir, dirent.name))
      : dirent.name.endsWith('.md')
        ? [join(dir, dirent.name)]
        : [],
  )

describe('the skill', () => {
  it('has frontmatter naming its folder and saying when it activates', () => {
    const text = readFileSync(join(skill, 'SKILL.md'), 'utf8')
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] ?? ''

    expect(frontmatter).toMatch(/^name: mise$/m)

    expect(frontmatter.replace(/\s+/g, ' ')).toMatch(
      /Activates when .+; or when the user mentions .+\.$/,
    )
  })

  it('names every component folder in its index', () => {
    const text = readFileSync(join(skill, 'SKILL.md'), 'utf8')

    const missing = componentFolders()
      .map(({ path }) => {
        const entries = folderExports(readFileSync(join(componentsDir, path, 'index.ts'), 'utf8'))
        const name = path.split('/')[1]

        return (
          entries.find((entry) => entry.component && entry.from === `./${name}.svelte`)?.name ??
          name
        )
      })
      .filter((name) => !new RegExp(`\\b${name}\\b`).test(text))

    expect(missing).toEqual([])
  })

  it('links only to files that exist', () => {
    const broken = markdownFiles(skill).flatMap((file) =>
      [...readFileSync(file, 'utf8').matchAll(/\]\((?!https?:|#)([^)#]+)/g)]
        .map((match) => match[1])
        .filter((target) => !existsSync(resolve(dirname(file), target)))
        .map((target) => `${file.slice(root.length + 1)} -> ${target}`),
    )

    expect(broken).toEqual([])
  })
})
