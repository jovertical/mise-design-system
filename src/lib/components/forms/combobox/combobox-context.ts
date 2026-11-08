/**
 * Origin: the React package 2.23.0 `combobox.tsx` (Base UI's Combobox context)
 * Diverged: what the root shares with ComboboxInput, so its clear button can
 *   empty the value and know whether there is one. Base UI held this itself.
 */
import { getContext, setContext } from 'svelte'

export type ComboboxContext = {
  readonly hasValue: boolean
  clear: () => void
}

const KEY = Symbol('mise-combobox')

export const setComboboxContext = (context: ComboboxContext) => setContext(KEY, context)

export const getComboboxContext = () => getContext<ComboboxContext | undefined>(KEY)
