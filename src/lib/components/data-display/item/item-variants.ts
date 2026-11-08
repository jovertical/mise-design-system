/**
 * Origin: the React package 2.23.0 `item.tsx` (`itemVariants`, `itemMediaVariants`)
 * Diverged: split out of the component file, as badge-variants.ts is. Size
 *   `default` is `md`, the vocabulary's name for the middle size; `sm` and
 *   `flush` unchanged. Classes and the other values unchanged.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const itemVariants = cva(
  'group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-muted/50 [button]:hover:bg-muted/50 [button]:w-full [button]:cursor-pointer [button]:text-left duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border-border',
        muted: 'bg-muted/50',
      },
      size: {
        md: 'p-4 gap-4',
        sm: 'py-3 px-4 gap-2.5',
        flush: 'py-1.5 px-0 gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export type ItemVariant = NonNullable<VariantProps<typeof itemVariants>['variant']>
export type ItemSize = NonNullable<VariantProps<typeof itemVariants>['size']>

export const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: '',
        image: 'size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type ItemMediaVariant = NonNullable<VariantProps<typeof itemMediaVariants>['variant']>
