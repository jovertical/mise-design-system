/**
 * Origin: the React package 2.23.0 `use-media-uploader.ts`, in its hooks folder
 * Diverged: the type and size checks MediaUploader runs on a dropped file,
 *   apart from the class so it stays under the size the clean-code guide
 *   allows. The rules are React's: an `accept` list in the grammar of a native
 *   `<input accept>`, and one size ceiling.
 */
import type { RejectedFile } from './media-uploader.svelte.js'

/** Why a file is refused, or null when it may be uploaded. */
export function refuse(
  file: File,
  acceptedTypes: string[],
  maxSize: number,
): Omit<RejectedFile, 'id' | 'name'> | null {
  if (!acceptedTypes.some((pattern) => matches(file, pattern))) {
    return { reason: 'type', message: `${describe(acceptedTypes)} only.` }
  }

  if (file.size > maxSize) {
    return { reason: 'size', message: `Larger than ${formatSize(maxSize)}.` }
  }

  return null
}

/**
 * `image/png` matches itself, `image/*` any image, and `.pdf` by extension:
 * the grammar a native `<input accept>` takes, and browsers report an empty
 * `file.type` for some documents.
 */
function matches(file: File, pattern: string): boolean {
  if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase())

  if (pattern === file.type) return true

  if (!pattern.endsWith('/*')) return false

  return file.type.startsWith(pattern.slice(0, -1))
}

/** `image/png,.pdf` reads as `PNG, PDF` on screen. */
function describe(acceptedTypes: string[]): string {
  const labels = acceptedTypes
    .map((pattern) => {
      if (pattern.startsWith('.')) return pattern.slice(1).toUpperCase()

      if (pattern.endsWith('/*')) return pattern.split('/')[0]?.toUpperCase()

      return pattern.split('/')[1]?.toUpperCase()
    })
    .filter(Boolean)

  return Array.from(new Set(labels)).join(', ')
}

function formatSize(bytes: number): string {
  const megabytes = bytes / 1024 / 1024

  return megabytes >= 1 ? `${Math.round(megabytes)}MB` : `${Math.round(bytes / 1024)}KB`
}
