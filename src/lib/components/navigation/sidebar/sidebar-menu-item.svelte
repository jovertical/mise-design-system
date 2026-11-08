<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuItem`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLLiAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuItemProps = WithElementRef<HTMLLiAttributes, HTMLLIElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: SidebarMenuItemProps = $props()
</script>

<li
  bind:this={ref}
  data-slot="sidebar-menu-item"
  data-sidebar="menu-item"
  class={cn('group/menu-item relative', className)}
  {...rest}
>
  {@render children?.()}
</li>
