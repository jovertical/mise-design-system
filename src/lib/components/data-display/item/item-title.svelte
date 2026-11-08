<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemTitle`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type ItemTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ItemTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="item-title"
  class={cn('flex w-fit max-w-full items-center gap-2 text-sm leading-snug font-medium', className)}
  {...rest}
>
  {@render children?.()}
</div>
