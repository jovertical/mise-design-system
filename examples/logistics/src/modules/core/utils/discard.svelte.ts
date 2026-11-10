/**
 * The "Discard changes?" prompt every create and edit page shares: whether it
 * is open, and the navigation waiting on its answer. entityForm's guard opens
 * it; the dialog FormPage draws answers it.
 */
/** The open discard prompt, and how to answer the navigation waiting on it. */
export const discard = $state<{ open: boolean; resolve: ((leave: boolean) => void) | null }>({
  open: false,
  resolve: null,
})

/** Opens the discard dialog; resolves true to leave, false to stay. */
export function askToDiscard(): Promise<boolean> {
  return new Promise((resolve) => {
    discard.resolve = resolve
    discard.open = true
  })
}

export function answerDiscard(leave: boolean) {
  const resolve = discard.resolve

  discard.open = false
  discard.resolve = null

  resolve?.(leave)
}
