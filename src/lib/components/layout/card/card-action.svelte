<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardAction`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The header's top-right slot, for something the reader can do: a menu, an
   * Edit link, a view toggle. Not a place to park a figure. A count where every
   * other card puts its action reads as one; if a heading needs qualifying, put
   * a hint next to the title.
   */
  export type CardActionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: CardActionProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-action"
  class={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
  {...rest}
>
  {@render children?.()}
</div>
