<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarGroup`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarGroupProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-group"
  data-sidebar="group"
  class={cn(
    'relative flex w-full min-w-0 flex-col px-4 py-2 group-data-[collapsible=icon]:px-2',
    'group-data-[sidetheme=panel]:px-2 group-data-[sidetheme=panel]:py-1',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
