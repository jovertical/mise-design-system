import { existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The purpose groups, in sidebar order: folder name to story title. A folder
 * under src/lib/components/ that is not listed here fails the stories suite.
 * See docs/naming.md §7 for what goes where.
 */
export const GROUPS = {
  typography: 'Typography',
  actions: 'Actions',
  forms: 'Forms',
  navigation: 'Navigation',
  layout: 'Layout',
  overlays: 'Overlays',
  feedback: 'Feedback',
  'data-display': 'Data display',
} as const

/** Folders whose story title is not the folder name in PascalCase. */
export const TITLE_ALIASES: Record<string, string> = { 'input-otp': 'InputOTP', sonner: 'Toaster' }

export const componentsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'lib',
  'components',
)

const subfolders = (path: string) =>
  existsSync(path)
    ? readdirSync(path, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name)
        .sort()
    : []

export const groupFolders = () => subfolders(componentsDir)

/** Every component folder, with its group and its `group/name` path. */
export const componentFolders = () =>
  groupFolders().flatMap((group) =>
    subfolders(join(componentsDir, group)).map((name) => ({
      group,
      name,
      path: `${group}/${name}`,
    })),
  )

export const pascal = (folder: string) =>
  TITLE_ALIASES[folder] ??
  folder.replace(/(^|-)([a-z])/g, (_, __, letter: string) => letter.toUpperCase())
