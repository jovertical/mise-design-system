<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardFooter`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * `bleed` runs the footer to the card's edges, for a footer that is one wide
   * target ("View all orders") rather than content with actions in it. Three
   * things happen together, which is why it is one prop: the card's bottom
   * padding is cancelled, the horizontal padding goes (a Button inside gets
   * the card's gutter back, so its label lines up with the title), and the
   * bottom corners are rounded and clipped.
   *
   * `divided` draws the rule above the footer, the mirror of `CardHeader`'s.
   *
   * `variant="muted"` is the recessed band: a wash, its own `py-3`, and a
   * bottom radius that matches the card's own.
   */
  export type CardFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    bleed?: boolean
    divided?: boolean
    variant?: 'default' | 'muted'
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    bleed = false,
    divided = false,
    variant = 'default',
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-footer"
  data-bleed={bleed || undefined}
  data-variant={variant}
  class={cn(
    'flex items-center px-(--card-spacing) [.border-t]:pt-(--card-spacing)',
    divided && 'border-t',
    variant === 'muted' &&
      'bg-muted/40 text-muted-foreground rounded-b-[min(var(--radius-4xl),24px)] py-3 text-sm',
    bleed &&
      '-mb-(--card-spacing) overflow-hidden rounded-b-[min(var(--radius-4xl),24px)] px-0 [.border-t]:pt-0 [&_[data-slot=button]]:px-(--card-spacing)',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
