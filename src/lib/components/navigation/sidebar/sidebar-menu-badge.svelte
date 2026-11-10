<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuBadge`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: on `panel`, it sits on the 32px row whatever the button's size,
    as the portals placed it.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuBadgeProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: SidebarMenuBadgeProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-menu-badge"
  data-sidebar="menu-badge"
  class={cn(
    'text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none',
    'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-data-[sidetheme=light]:peer-data-[active=true]/menu-button:text-white',
    'group-data-[sidetheme=panel]:peer-data-[active=true]/menu-button:text-sidebar-primary-foreground',
    'peer-data-[size=sm]/menu-button:top-1',
    'peer-data-[size=default]/menu-button:top-1.5',
    'peer-data-[size=lg]/menu-button:top-2.5',
    'group-data-[sidetheme=panel]:top-1.5! group-data-[sidetheme=panel]:right-2',
    'group-data-[collapsible=icon]:hidden',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
