/**
 * Looks components and parts up in mise's API data. A name mise does not
 * have throws, so a page that names one fails the prerender instead of
 * showing an empty table.
 */
import allDocs from 'virtual:mise-api'

import type { FolderDoc, PartDoc } from './api-types.js'

export function folderNamed(name: string, docs: FolderDoc[] = allDocs): FolderDoc {
  const folder = docs.find((candidate) => candidate.name === name)

  if (!folder) throw new Error(`No component named ${name} in mise`)

  return folder
}

export function partNamed(
  name: string,
  docs: FolderDoc[] = allDocs,
): { folder: FolderDoc; part: PartDoc } {
  for (const folder of docs) {
    const part = folder.parts.find((candidate) => candidate.name === name)

    if (part) return { folder, part }
  }

  throw new Error(`No part named ${name} in mise`)
}
