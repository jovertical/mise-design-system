/**
 * The last step of the header's breadcrumb on a detail page. The URL carries
 * an id or a code; the page knows the record's name and sets it here, and
 * clears it when it goes.
 */
export const crumb = $state<{ leaf: string | null }>({ leaf: null })

/** Call from a detail page's script: names the record while the page is up. */
export function nameThisPage(name: () => string | undefined) {
  $effect(() => {
    crumb.leaf = name() ?? null
    return () => {
      crumb.leaf = null
    }
  })
}
