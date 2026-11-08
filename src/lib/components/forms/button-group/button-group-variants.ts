/**
 * Origin: the React package 2.23.0 `button-group.tsx` (`buttonGroupVariants`), itself shadcn/ui new-york `button-group`
 * Diverged: split out of the component file, as field-variants.ts is. Joined
 *   children overlap by a pixel (`-ml-px`, `-mt-px` when vertical) instead of
 *   dropping a border (`border-l-0`, `border-t-0`), and a toned child is raised
 *   above its neighbours, so a critical outline button keeps its whole outline;
 *   React's drops the shared side and shows its neighbour's grey edge there.
 */
import { cva, type VariantProps } from 'class-variance-authority'

export const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-tone]:not([data-tone=neutral])]:relative [&>[data-tone]:not([data-tone=neutral])]:z-[1] [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
)

export type ButtonGroupOrientation = NonNullable<
  VariantProps<typeof buttonGroupVariants>['orientation']
>
