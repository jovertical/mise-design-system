/**
 * Origin: the React package 2.23.0 `icon-chip.tsx` (`iconChipVariants`, `iconChipClassName`)
 * Diverged: split out of the component file, as badge-variants.ts is. Classes
 *   unchanged; `iconChipClassName` types its options inline rather than picking
 *   them from the component's props.
 */
import { cva } from 'class-variance-authority'

import { cn } from '../../../utils/cn.js'
import { type Size, TONE_SOFT_CLASS, type Tone } from '../../../utils/tone.js'

export type IconChipShape = 'square' | 'circle'

export const iconChipVariants = cva(
  'inline-grid shrink-0 place-items-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
        md: "size-10 [&_svg:not([class*='size-'])]:size-5",
        lg: "size-12 [&_svg:not([class*='size-'])]:size-5",
      },
      shape: {
        square: '',
        circle: 'rounded-full',
      },
    },
    compoundVariants: [
      { shape: 'square', size: 'sm', class: 'rounded-lg' },
      { shape: 'square', size: 'md', class: 'rounded-xl' },
      { shape: 'square', size: 'lg', class: 'rounded-xl' },
    ],
    defaultVariants: {
      size: 'sm',
      shape: 'square',
    },
  },
)

/**
 * The chip's classes, for a component that draws the chip on an element it
 * already owns.
 *
 * `ItemMedia variant="icon"` is the case: a slot with its own alignment rules,
 * whose chip used to be a second, hand-kept copy of this one — the same 32px
 * squircle, but without the muted ink or a `tone`. Wrapping an `IconChip`
 * inside the slot would add a node and move the alignment off the chip;
 * reading the classes from here keeps one chip and one element.
 */
export function iconChipClassName({
  size = 'sm',
  shape = 'square',
  tone = 'neutral',
}: {
  size?: Size
  shape?: IconChipShape
  tone?: Tone
} = {}): string {
  return cn(iconChipVariants({ size, shape }), TONE_SOFT_CLASS[tone])
}
