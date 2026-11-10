/**
 * What the skill catalogue and the docs site know about each component
 * folder: its entry point, its parts with their props (types made readable),
 * its other runtime exports and its named types. Reads the source; renders
 * nothing.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { literalAliases } from './aliases.js'
import { type ExportDoc, folderExports } from './exports.js'
import { type PropDoc, type PropsDoc, propDefaults, propsDoc } from './props.js'
import { scripts } from './svelte-source.js'

export const PACKAGE = '@jovertical/mise-design-system'

export type PartDoc = {
  name: string
  /** False when the part has no `<Name>Props` type to read. */
  documented: boolean
  summary: string
  props: PropDoc[]
  alsoTakes: string[]
}

export type NamedType = { name: string; literals: string | null }

export type FolderDoc = {
  group: string
  folder: string
  /** The root part's export name, or the folder's when it has no component. */
  name: string
  entry: string
  imports: string[]
  parts: PartDoc[]
  values: string[]
  types: NamedType[]
}

type FolderInput = {
  root: string
  group: string
  folder: string
  formFolders: Set<string>
  aliases: Map<string, string>
}

type RawPart = PropsDoc & { name: string }

/** Every component folder, sorted by group, then folder. */
export function componentDocs(root: string): FolderDoc[] {
  const componentsDir = join(root, 'src', 'lib', 'components')
  const formFolders = formEntryFolders(root)
  const aliases = literalAliases(typeSources(join(root, 'src', 'lib')))

  return subfolders(componentsDir).flatMap((group) =>
    subfolders(join(componentsDir, group)).map((folder) =>
      folderDoc({ root, group, folder, formFolders, aliases }),
    ),
  )
}

const subfolders = (path: string) =>
  readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort()

/** Every `.ts` file and `.svelte` module script under a directory. */
function typeSources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((dirent) => {
    const path = join(dir, dirent.name)

    if (dirent.isDirectory()) return typeSources(path)

    if (dirent.name.endsWith('.ts') && !dirent.name.endsWith('.d.ts')) {
      return [readFileSync(path, 'utf8')]
    }

    if (dirent.name.endsWith('.svelte') && !dirent.name.endsWith('.stories.svelte')) {
      const { module } = scripts(readFileSync(path, 'utf8'))

      return module ? [module] : []
    }

    return []
  })
}

function formEntryFolders(root: string) {
  const formEntry = readFileSync(join(root, 'src', 'lib', 'form.ts'), 'utf8')

  return new Set(
    [...formEntry.matchAll(/components\/([\w-]+\/[\w-]+)\/index\.js/g)].map((match) => match[1]),
  )
}

function folderDoc({ root, group, folder, formFolders, aliases }: FolderInput): FolderDoc {
  const folderPath = join(root, 'src', 'lib', 'components', group, folder)
  const entries = folderExports(readFileSync(join(folderPath, 'index.ts'), 'utf8'))
  const components = entries.filter((entry) => entry.component)
  const rootPart = components.find((entry) => entry.from === `./${folder}.svelte`) ?? components[0]
  const values = entries.filter((entry) => !entry.component && !entry.typeOnly)
  const types = entries.filter((entry) => entry.typeOnly && !entry.name.endsWith('Props'))
  const ordered = rootPart ? [rootPart, ...components.filter((part) => part !== rootPart)] : []

  return {
    group,
    folder,
    name: rootPart?.name ?? folder,
    entry: formFolders.has(`${group}/${folder}`) ? `${PACKAGE}/form` : PACKAGE,
    imports: [...components, ...values].map((part) => part.name),
    parts: partDocs(folderPath, ordered, aliases),
    values: values.map((value) => value.name),
    types: types.map((type) => ({ name: type.name, literals: aliases.get(type.name) ?? null })),
  }
}

function partDocs(folderPath: string, ordered: ExportDoc[], aliases: Map<string, string>) {
  const raw = new Map(ordered.map((part) => [part.name, rawPart(folderPath, part)]))

  const siblings = new Map([...raw].filter((pair): pair is [string, RawPart] => pair[1] !== null))

  return ordered.map((part): PartDoc => {
    const doc = raw.get(part.name) ?? null

    if (!doc) return { name: part.name, documented: false, summary: '', props: [], alsoTakes: [] }

    return {
      name: part.name,
      documented: true,
      summary: doc.summary,
      alsoTakes: doc.alsoTakes,
      props: doc.props.map((prop) => ({
        ...prop,
        type: readableType(prop.type, aliases, siblings),
      })),
    }
  })
}

function rawPart(folderPath: string, entry: ExportDoc): RawPart | null {
  const file = join(folderPath, entry.from)

  if (!existsSync(file)) return null

  const { module, instance } = scripts(readFileSync(file, 'utf8'))
  const doc = module ? propsDoc(module, `${entry.name}Props`) : null

  if (!doc) return null

  const defaults = instance ? propDefaults(instance) : new Map<string, string | null>()

  return {
    name: entry.name,
    ...doc,
    props: doc.props.map((prop) => ({ ...prop, default: defaults.get(prop.name) ?? null })),
  }
}

/**
 * A prop's type as a reader should see it: a literal alias spelled out, and
 * `SiblingProps['key']` replaced by that sibling's own type for the key.
 */
function readableType(
  type: string,
  aliases: Map<string, string>,
  siblings: Map<string, PropsDoc>,
): string {
  const indexed = type.match(/^(\w+)Props\['(\w+)'\]$/)

  const sibling = indexed
    ? siblings.get(indexed[1])?.props.find((prop) => prop.name === indexed[2])
    : null

  const resolved = sibling?.type ?? type

  return aliases.get(resolved) ?? resolved
}
