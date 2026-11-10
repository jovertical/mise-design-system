<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuSub`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: on `panel`, the list keeps no right inset, as the portals draw it.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuSubProps = WithElementRef<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  >
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarMenuSubProps = $props()
</script>

<ul
  bind:this={ref}
  data-slot="sidebar-menu-sub"
  data-sidebar="menu-sub"
  class={cn(
    'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l-2 border-dotted py-0.5 pr-2.5',
    'group-data-[sidetheme=primary]:border-white/30 group-data-[sidetheme=light]:border-border',
    'group-data-[sidetheme=panel]:border-l group-data-[sidetheme=panel]:border-solid group-data-[sidetheme=panel]:border-sidebar-border group-data-[sidetheme=panel]:mr-0 group-data-[sidetheme=panel]:pr-0 group-data-[sidetheme=panel]:pt-1',
    'group-data-[collapsible=icon]:hidden',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</ul>
