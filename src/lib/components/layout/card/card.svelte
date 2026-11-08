<!--
  Origin: the React package 2.23.0 `card.tsx` (`Card`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port. The React header lists the divergences from shadcn.
-->
<script lang="ts" module>
  import { cva, type VariantProps } from 'class-variance-authority'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export const cardVariants = cva(
    'ring-foreground/5 dark:ring-foreground/10 flex flex-col gap-4 rounded-[min(var(--radius-4xl),24px)] py-(--card-spacing) shadow-sm ring-1 [--card-spacing:--spacing(5)]',
    {
      variants: {
        variant: {
          default: 'bg-card text-card-foreground',
          ghost: 'bg-transparent shadow-none ring-0 py-0 gap-2',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  )

  export type CardVariant = NonNullable<VariantProps<typeof cardVariants>['variant']>

  /**
   * Padding is a `--card-spacing` variable on both axes, at 20px, so a
   * full-bleed child can cancel it. The edge is a ring plus a shadow rather
   * than a border. `ghost` drops the surface for a block that wants the
   * card's rhythm but sits straight on the page.
   */
  export type CardProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: CardVariant
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    variant = 'default',
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card"
  data-variant={variant}
  class={cn(cardVariants({ variant }), className)}
  {...rest}
>
  {@render children?.()}
</div>
