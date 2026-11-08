<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarGroupContent`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarGroupContentProps = WithElementRef<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: SidebarGroupContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sidebar-group-content"
  data-sidebar="group-content"
  class={cn('w-full text-sm', className)}
  {...rest}
>
  {@render children?.()}
</div>
