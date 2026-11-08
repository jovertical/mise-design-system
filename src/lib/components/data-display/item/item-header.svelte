<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemHeader`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type ItemHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ItemHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="item-header"
  class={cn('flex basis-full items-center justify-between gap-2', className)}
  {...rest}
>
  {@render children?.()}
</div>
