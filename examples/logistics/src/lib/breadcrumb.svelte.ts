/**
 * The end of the header's breadcrumb. On a detail page the URL carries an id
 * or a code; the page knows the record's name and sets `leaf`. A create or
 * edit page also sets `step` ("New order", "Edit"), which follows the record.
 * Both clear when the page goes.
 */
export const crumb = $state<{ leaf: string | null; step: string | null }>({
  leaf: null,
  step: null,
})

/** Call from a detail page's script: names the record while the page is up. */
export function nameThisPage(name: () => string | undefined) {
  $effect(() => {
    crumb.leaf = name() ?? null
    return () => {
      crumb.leaf = null
    }
  })
}

/** Call from a create or edit page's script: the step, after the record if there is one. */
export function markThisPage(step: string, name?: () => string | undefined) {
  $effect(() => {
    crumb.step = step
    crumb.leaf = name?.() ?? null
    return () => {
      crumb.step = null
      crumb.leaf = null
    }
  })
}
