/**
 * Origin: the React package 2.23.0 `combobox.tsx` (Base UI's Combobox context)
 * Diverged: what the root shares with ComboboxInput, so its clear button can
 *   empty the value and know whether there is one, and, with
 *   `allowCustomValue`, so its text can be the value. Base UI held this itself.
 */
import { getContext, setContext } from 'svelte'

export type ComboboxContext = {
  readonly hasValue: boolean
  clear: () => void
  /** With `allowCustomValue`, the typed text is the value. */
  readonly allowCustomValue: boolean
  /** The bound value as text, for the field to start from when it is no item's. */
  readonly text: string
  setText: (text: string) => void
}

const KEY = Symbol('mise-combobox')

export const setComboboxContext = (context: ComboboxContext) => setContext(KEY, context)

export const getComboboxContext = () => getContext<ComboboxContext | undefined>(KEY)
