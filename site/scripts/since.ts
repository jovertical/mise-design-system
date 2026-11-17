/**
 * `pnpm --filter mise-docs since`: writes src/modules/docs/data/since.json,
 * the release each component folder first shipped in, from the `v*` tags. Run
 * after each release; a folder missing from the file shows as Unreleased.
 */
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { firstReleases, type Release } from './since-walk.js'

const repository = join(import.meta.dirname, '..', '..')
const output = join(import.meta.dirname, '..', 'src', 'modules', 'docs', 'data', 'since.json')

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: repository, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)

/** `src/lib/components/<group>/<folder>` at a tag, wherever the folder sat then. */
function foldersAt(tag: string): string[] {
  const groups = git('ls-tree', '-d', '--name-only', `${tag}:src/lib/components`)

  return groups.flatMap((group) =>
    git('ls-tree', '-d', '--name-only', `${tag}:src/lib/components/${group}`),
  )
}

const releases: Release[] = git('tag', '--list', 'v*').map((tag) => ({
  version: tag.slice(1),
  folders: foldersAt(tag),
}))

writeFileSync(output, `${JSON.stringify(firstReleases(releases), null, 2)}\n`)

console.log(`Wrote ${Object.keys(firstReleases(releases)).length} folders to ${output}`)
