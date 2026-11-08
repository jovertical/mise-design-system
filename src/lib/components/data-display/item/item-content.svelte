<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemContent`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: flex-none:`min-w-0` so a long title can truncate, carried over from the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type ItemContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ItemContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="item-content"
  class={cn('flex min-w-0 flex-1 flex-col gap-1 [&+[data-slot=item-content]]', className)}
  {...rest}
>
  {@render children?.()}
</div>
