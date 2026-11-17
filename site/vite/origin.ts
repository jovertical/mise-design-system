/**
 * Where a component came from, by the rule mise's provenance test applies to
 * its story tags: `shadcn` when the `Origin:` line descends from shadcn/ui,
 * `mise` otherwise (authored in mise, or ported from the React package alone).
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

export type Origin = 'shadcn' | 'mise'

export function originOf(source: string): Origin {
  const line = source.match(/Origin:([^\n]*)/)?.[1] ?? ''

  return line.includes('shadcn/ui') ? 'shadcn' : 'mise'
}

/** The folder's root component decides: `<folder>.svelte`, or `<folder>.ts` for a folder of helpers. */
export function folderOrigin(directory: string, folder: string): Origin {
  const root = [`${folder}.svelte`, `${folder}.ts`]
    .map((name) => join(directory, name))
    .find((path) => existsSync(path))

  return root ? originOf(readFileSync(root, 'utf8')) : 'mise'
}
