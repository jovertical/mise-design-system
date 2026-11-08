<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarHeader`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-header"
  data-sidebar="header"
  class={cn(
    'flex flex-col gap-2 p-2 h-header min-h-header items-center justify-center',
    'group-data-[sidetheme=primary]:border-white/30 group-data-[sidetheme=light]:border-border',
    'border-b group-data-[sidetheme=panel]:border-b-0',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
