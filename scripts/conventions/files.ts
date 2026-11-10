/**
 * Which files the clean-code check reads: every `.ts` and `.svelte` file under
 * mise's sources, the examples' and the docs site's, never anything built or
 * installed.
 */
import { readdirSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const MISE_ROOTS = ['src', 'tests', 'scripts', 'stories']
const EXAMPLE_ROOTS = ['src', 'tests', 'scripts']
const SITE_ROOTS = ['site/src', 'site/tests', 'site/scripts', 'site/vite']

const SKIPPED = new Set([
  'node_modules',
  'dist',
  'build',
  '.svelte-kit',
  'storybook-static',
  '.tmp',
  '.smoke',
])

/** Repository-relative paths with forward slashes, sorted. */
export function checkedFiles(root: string): string[] {
  const examples = listDirectories(join(root, 'examples')).flatMap((example) =>
    EXAMPLE_ROOTS.map((folder) => join('examples', example, folder)),
  )

  return [...MISE_ROOTS, ...examples, ...SITE_ROOTS]
    .flatMap((folder) => walk(join(root, folder)))
    .map((path) => relative(root, path).split(sep).join('/'))
    .toSorted()
}

function walk(directory: string): string[] {
  if (!exists(directory)) return []

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (SKIPPED.has(entry.name)) return []

    const path = join(directory, entry.name)

    if (entry.isDirectory()) return walk(path)

    return /\.(ts|svelte)$/.test(entry.name) ? [path] : []
  })
}

function listDirectories(directory: string): string[] {
  if (!exists(directory)) return []

  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
}

function exists(path: string) {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}
