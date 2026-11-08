<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenu`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuProps = WithElementRef<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarMenuProps = $props()
</script>

<ul
  bind:this={ref}
  data-slot="sidebar-menu"
  data-sidebar="menu"
  class={cn('flex w-full min-w-0 flex-col gap-1', className)}
  {...rest}
>
  {@render children?.()}
</ul>
