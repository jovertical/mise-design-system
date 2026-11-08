<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarContent`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** Scrolls vertically in icon mode too: a long rail must not lose its last icons off the viewport. */
  export type SidebarContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-content"
  data-sidebar="content"
  class={cn(
    'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-x-hidden group-data-[collapsible=icon]:overflow-y-auto',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
