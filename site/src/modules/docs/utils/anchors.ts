import { slugOf } from '../../../../vite/markdown.js'

export { slugOf }

/** The id of a part's API table, which the anatomy legend links to. */
export function apiAnchor(partName: string): string {
  return `api-${partName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`
}
