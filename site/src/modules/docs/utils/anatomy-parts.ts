/**
 * What an anatomy names: each part, how to find it in the example, and the
 * key it goes by in the legend. A part mise renders is found by its
 * `data-slot`; one a dependency renders without a slot (svelte-sonner's toast)
 * by a CSS `selector` instead.
 */
import type { Placement } from './anatomy-layout.js'

/**
 * `part` is the export name the legend links to. `placement` is where the
 * marker sits: `side` (the default) for parts stacked in a column, `top` or
 * `bottom` for a part in a row beside others. Give `slot` or `selector`.
 */
export type AnatomyPart = {
  slot?: string
  selector?: string
  label: string
  part?: string
  placement?: Placement
}

export function partQuery(part: AnatomyPart): string {
  return part.selector ?? `[data-slot="${part.slot}"]`
}

export function partKey(part: AnatomyPart): string {
  return part.slot ?? part.selector ?? part.label
}
