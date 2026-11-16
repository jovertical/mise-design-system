/**
 * What the smoke run checks in a page's DOM after its scripts ran. Each
 * returns the problem, or null when the page is fine.
 */
const count = (dom: string, pattern: RegExp) => [...dom.matchAll(pattern)].length

/** The title of the docs' not-found page (src/modules/shell/components/not-found.svelte). */
const NOT_FOUND_TITLE = 'No page here'

function mainText(dom: string) {
  const main = dom.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? ''

  return main.replace(/<[^>]+>/g, '').trim()
}

/** A docs page: content, no SvelteKit error, and every anatomy fully drawn. */
export function pageVerdict(dom: string): string | null {
  if (!mainText(dom)) return 'empty <main>'

  if (/data-sveltekit-error|Internal Error/.test(dom)) return "SvelteKit's error page"

  // The docs' own not-found page, by its wording: the ErrorState page shows
  // error states on purpose, so the component's slot alone proves nothing.
  if (dom.includes(NOT_FOUND_TITLE)) return 'rendered the not-found page'

  const expected = [...dom.matchAll(/data-anatomy-count="(\d+)"/g)].reduce(
    (total, match) => total + Number(match[1]),
    0,
  )

  const drawn = count(dom, /data-anatomy-marker/g)

  if (drawn < expected) return `anatomy drew ${drawn} of ${expected} markers`

  const missing = dom.match(/data-anatomy-missing="([^"]+)"/)?.[1]

  if (missing) return `anatomy part ${missing} not found`

  return null
}

/** An address that is no page: the docs' not-found page. */
export function notFoundVerdict(dom: string): string | null {
  return dom.includes(NOT_FOUND_TITLE) ? null : 'expected the not-found page'
}

/** A demo deep link: the demo's own page, reached through the redirect. */
export function demoVerdict(dom: string): string | null {
  if (!mainText(dom)) return 'empty <main>'

  if (/data-slot="error-state"/.test(dom)) return 'landed on a not-found page'

  if (!/OR-2041/.test(dom)) return 'did not land on the order'

  return null
}
