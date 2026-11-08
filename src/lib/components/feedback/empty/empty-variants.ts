/**
 * Origin: the React package 2.23.0 `empty.tsx` (`emptyMediaVariants`), itself shadcn/ui new-york `empty`
 * Diverged: split out of the component file, as badge-variants.ts is.
 *   Classes, variants and defaults unchanged.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        // A ringed circle on the page's own surface, not a filled square. The
        // chip reads as a frame around the glyph rather than as a tile, which
        // is what keeps a large empty panel from looking like a broken card.
        icon: "bg-background text-muted-foreground ring-border flex size-14 shrink-0 items-center justify-center rounded-full ring-1 [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type EmptyMediaVariant = NonNullable<VariantProps<typeof emptyMediaVariants>['variant']>
