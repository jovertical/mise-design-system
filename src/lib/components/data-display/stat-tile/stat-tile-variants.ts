/**
 * Origin: the React package 2.23.0 `stat-tile.tsx` (its size and alignment maps, `StatRow`)
 * Diverged: split out of the component file, as icon-chip-variants.ts is, so
 *   StatTile keeps under the size the clean-code guide allows. Classes and
 *   types unchanged.
 */
import type { Snippet } from 'svelte'

import type { Tone } from '../../../utils/tone.js'

/**
 * How big the figure is, named for the density it is drawn for rather than a
 * type step: `sm` a dense row or a figure inside another card, `md` (the
 * default) four across, `lg` one or two across or the point of the screen.
 */
export type StatSize = 'sm' | 'md' | 'lg'

export const SIZE_CLASS: Record<StatSize, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-3xl',
}

export const SIZE_SKELETON_CLASS: Record<StatSize, string> = {
  sm: 'h-6 w-16',
  md: 'h-7 w-20',
  lg: 'h-9 w-24',
}

/**
 * The chip's footprint, apart from the figure's density. `IconChip`'s sizes
 * are 32 / 40 / 48px and the tile's chip was 40 / 48 / 48, so `sm` maps to the
 * chip's `md` and `md` and `lg` to its `lg`. Defaults to `size`.
 */
export type StatIconSize = StatSize

export const ICON_CHIP_SIZE: Record<StatIconSize, 'md' | 'lg'> = { sm: 'md', md: 'lg', lg: 'lg' }

/**
 * `center`, the default, centres the chip against the label, figure and
 * description; `top` pins it level with the label, for a column a delta or a
 * long description has made tall.
 */
export type StatIconAlignment = 'center' | 'top'

export const ICON_ROW_ALIGN_CLASS: Record<StatIconAlignment, string> = {
  center: 'items-center',
  top: 'items-start',
}

/**
 * `card` is a tile in its own right, one of a row. `inset` is the summary at
 * the top of a card whose chart or table is the evidence: recessed, no
 * shadow, its caption small and upper-case so it does not compete with the
 * card's own title.
 */
export type StatSurface = 'card' | 'inset'

export type StatRow = {
  /** Stable key. Labels repeat across tiles, so they are not one. */
  id: string
  label: string | Snippet
  value: string | number | Snippet | null
  /**
   * Colours the value: "this figure has a direction". For a directional
   * pair (stock in against stock out), not the parts of a total. Leave it
   * off unless every row in the group has one; a single tinted row reads as
   * an alert.
   */
  tone?: Tone
}
