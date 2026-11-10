/**
 * Origin: the React package 2.23.0 `toggle.tsx` (`toggleVariants`), itself shadcn/ui new-york `toggle`
 * Diverged: split out of the component file, as badge-variants.ts is.
 *   Classes, variants and defaults unchanged.
 */
import { cva, type VariantProps } from 'class-variance-authority'

import { segmentedItem } from '../../../utils/segmented-control.js'

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    // `size` first, `variant` second. cva emits variants in declaration order,
    // so the later group wins a conflict — and `segmented` carries its own
    // height and padding, which a size would otherwise overwrite.
    variants: {
      size: {
        default: 'h-9 px-2 min-w-9',
        sm: 'h-8 px-1.5 min-w-8',
        lg: 'h-10 px-2.5 min-w-10',
      },
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
        // One option inside a segmented track. It measures itself against the
        // track rather than against a size, which is why it overrides both.
        segmented: segmentedItem,
        /**
         * Outlined when off, filled with the brand when on — for a grid of
         * toggles read at a glance, where "on" has to stand out across a whole
         * table rather than sit quietly in a toolbar. The default `accent`
         * fill is too close to the off state at that distance.
         *
         * Pressed and disabled keeps the fill at the disabled opacity: a value
         * that is on and cannot be changed, such as a locked role's column.
         *
         * Keyed off `aria-pressed`, not `data-state`. A `TooltipTrigger
         * asChild` writes its own `data-state` (`closed`, `delayed-open`) onto
         * the toggle and erases `on`, so a solid toggle with a tooltip, which
         * is every editable cell of a matrix, would always read as off. The
         * `data-[state=on]` pair stays only to replace the base's accent fill,
         * which would otherwise fight the brand fill on a toggle with no
         * tooltip.
         */
        solid:
          'border border-input bg-transparent text-muted-foreground hover:bg-muted data-[state=on]:bg-primary data-[state=on]:text-primary-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90',
      },
      /**
       * One glyph and no label: a circle the size of the toggle's height. It
       * needs an `aria-label`. A flag rather than more sizes, as on `Button`,
       * so "how big" and "what shape" stay two choices.
       */
      iconOnly: {
        true: 'rounded-full px-0 min-w-0',
        false: '',
      },
    },
    compoundVariants: [
      { iconOnly: true, size: 'sm', class: 'size-8' },
      { iconOnly: true, size: 'default', class: 'size-9' },
      { iconOnly: true, size: 'lg', class: 'size-10' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
      iconOnly: false,
    },
  },
)

export type ToggleVariant = NonNullable<VariantProps<typeof toggleVariants>['variant']>
type DrawnToggleSize = NonNullable<VariantProps<typeof toggleVariants>['size']>

/** `md` is mise's name for the middle size; `default` is the name shadcn gave it. */
export type ToggleSize = DrawnToggleSize | 'md'

/** The size the variants know: `md` drawn as `default`. */
export function drawnToggleSize(size: ToggleSize | undefined): DrawnToggleSize | undefined {
  return size === 'md' ? 'default' : size
}
