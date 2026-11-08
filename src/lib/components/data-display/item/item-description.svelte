<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemDescription`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: hover]:text-primary [&>a]:underline [&>a]:underline-offset-4:none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** Clamped to two lines for a list; pass `line-clamp-none` where the block is the point (an address). */
  export type ItemDescriptionProps = WithElementRef<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: ItemDescriptionProps = $props()
</script>

<p
  bind:this={ref}
  data-slot="item-description"
  class={cn(
    'text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance [&>a',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</p>
