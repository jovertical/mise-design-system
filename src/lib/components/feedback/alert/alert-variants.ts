/**
 * Origin: the React package 2.23.0 `alert.tsx` (`alertVariants`), itself shadcn/ui new-york `alert`
 * Diverged: split out of the component file, as badge-variants.ts is. The info
 *   icon's dark step reads mise's `--color-info-400` role ramp, where React read
 *   its own `--color-blue-400`. Everything else unchanged.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const alertVariants = cva(
  [
    'relative w-full rounded-lg px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start text-foreground [&>svg]:size-4 [&>svg]:translate-y-0.5',
    // A third column for `AlertAction`, from `sm` and only when there is one,
    // so an alert without an action keeps its two columns exactly.
    'sm:has-[>[data-slot=alert-action]]:grid-cols-[0_1fr_auto] sm:has-[>svg]:has-[>[data-slot=alert-action]]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]',
  ],
  {
    variants: {
      variant: {
        default: 'bg-card border [&>svg]:text-muted-foreground',
        info: 'bg-info-soft [&>svg]:text-info dark:[&>svg]:text-[var(--color-info-400)]',
        success:
          'bg-success-soft [&>svg]:text-success dark:[&>svg]:text-[var(--color-success-400)]',
        warning:
          'bg-warning-soft [&>svg]:text-warning dark:[&>svg]:text-[var(--color-warning-400)]',
        destructive: 'bg-destructive-soft [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type AlertVariant = NonNullable<VariantProps<typeof alertVariants>['variant']>
