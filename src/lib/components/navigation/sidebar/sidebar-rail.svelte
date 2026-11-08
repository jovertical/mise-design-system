<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarRail`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarRailProps = WithElementRef<HTMLButtonAttributes, HTMLButtonElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { useSidebar } from './context.svelte.js'

  let { ref = $bindable(null), class: className, ...rest }: SidebarRailProps = $props()

  const sidebar = useSidebar()
</script>

<button
  bind:this={ref}
  type="button"
  data-sidebar="rail"
  data-slot="sidebar-rail"
  aria-label="Toggle Sidebar"
  tabindex={-1}
  onclick={sidebar.toggle}
  title="Toggle Sidebar"
  class={cn(
    'hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex',
    'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
    '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
    'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
    '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
    '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
    className,
  )}
  {...rest}
></button>
