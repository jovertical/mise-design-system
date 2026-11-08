/**
 * Origin: the React package 2.23.0 `table.tsx` (`TableDensityContext`)
 * Diverged: Svelte context holding a getter, where React's held the boolean.
 */
import { getContext, setContext } from 'svelte'

/**
 * Row density, set once on `Table` and read by every head and cell beneath it.
 * Context rather than a prop per cell: density is a property of the table.
 */
const KEY = Symbol('mise-table-density')

export function setTableDensity(compact: () => boolean) {
  setContext(KEY, compact)
}

export function useTableCompact(): () => boolean {
  return getContext<(() => boolean) | undefined>(KEY) ?? (() => false)
}
