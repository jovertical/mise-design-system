/**
 * Origin: the React package 2.23.0 `form.tsx` (`useFormField`'s state)
 * Diverged: the field state formsnap hands a FormField's children, named so
 *   the parts can share it.
 */
import type { FsSuperForm } from 'formsnap'

export type { FsSuperForm }

export type FormFieldState<V> = {
  value: V
  errors: string[]
  tainted: boolean
  constraints: Record<string, unknown>
}
