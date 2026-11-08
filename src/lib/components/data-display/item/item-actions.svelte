<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemActions`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type ItemActionsProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ItemActionsProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="item-actions"
  class={cn('flex items-center gap-2', className)}
  {...rest}
>
  {@render children?.()}
</div>
