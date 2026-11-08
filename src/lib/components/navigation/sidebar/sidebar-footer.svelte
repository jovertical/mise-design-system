<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarFooter`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-footer"
  data-sidebar="footer"
  class={cn('flex flex-col gap-2 p-2', className)}
  {...rest}
>
  {@render children?.()}
</div>
