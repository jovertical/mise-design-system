/**
 * The superForm every create and edit page uses, set up the same way: in the
 * browser only (SPA, no server action), as JSON so packages and zones stay
 * arrays, validated by the entity's schema, and guarded so leaving with
 * unsaved changes asks first through the discard dialog FormPage draws.
 */
import { toast } from '@jovertical/mise-design-system'
import { defaults, type Infer, superForm } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import type { z } from 'zod'

import { askToDiscard } from '#lib/discard.svelte.js'

/**
 * `onsave` writes through the store and navigates. Once it returns, the form
 * counts as saved and the navigation it started is not challenged. If it
 * throws (a write refusing: a SKU in use, a zone below what it holds), the
 * message becomes a toast and the form stays as it was, still guarded.
 */
export function entityForm<S extends z.ZodObject>(
  schema: S,
  initial: Infer<S, 'zod4'>,
  onsave: (values: Infer<S, 'zod4'>) => void,
) {
  const adapter = zod4(schema)
  let saved = false

  return superForm(defaults(structuredClone(initial), adapter), {
    SPA: true,
    applyAction: false,
    dataType: 'json',
    resetForm: false,
    validators: adapter,
    taintedMessage: () => saved || askToDiscard(),
    onUpdate({ form: result, cancel }) {
      if (!result.valid) return

      saved = true

      try {
        onsave(result.data)
      } catch (error) {
        // Cancelling keeps superforms from treating the submit as done, which
        // would clear the changes it tracks and drop the guard.
        saved = false

        cancel()

        toast.error(error instanceof Error ? error.message : 'Could not save')
      }
    },
  })
}
