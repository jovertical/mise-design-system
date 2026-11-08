<!--
  Origin: the React package 2.23.0 `card-list.tsx`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A list of rows inside a card, separated by full-width rules. The rules run
   * to the card's edges: inset, they read as stripes drawn on the content;
   * full-bleed, they read as the card divided into rows.
   *
   * It cancels the card's horizontal padding and gives it back to each row, so
   * a row still lines up with the header. That is why it reads `--card-spacing`
   * rather than a literal. It has to sit inside a padded `CardContent`, the
   * padding it cancels; `px-0` there as well cancels it twice.
   *
   * `divide-y` sets only a border width, so a child with its own border colour
   * (an `Item`'s `border-transparent`) would paint the rule invisible. The rule's
   * colour is set here too, qualified by `[data-slot]` so it outranks the child.
   */
  export type CardListProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /**
     * Tighter rows, for rows of one line. The default `py-4` is sized for a
     * leading chip and two lines. A prop rather than a class at the call site:
     * a second arbitrary variant does not reliably win against this one.
     */
    compact?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    compact = false,
    class: className,
    children,
    ...rest
  }: CardListProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-list"
  class={cn(
    '-mx-(--card-spacing) divide-y [&>*]:px-(--card-spacing)',
    compact ? '[&>*]:py-2.5' : '[&>*]:py-4',
    '[&>[data-slot]+[data-slot]]:border-t-border',
    '[&>[data-slot]]:rounded-none',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
