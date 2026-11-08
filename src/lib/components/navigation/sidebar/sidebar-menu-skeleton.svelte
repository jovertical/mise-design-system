<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarMenuSkeleton`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarMenuSkeletonProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    showIcon?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'

  let {
    ref = $bindable(null),
    showIcon = false,
    class: className,
    ...rest
  }: SidebarMenuSkeletonProps = $props()

  // A width between 50 and 90%, so a column of placeholders does not read as a grid.
  const width = `${Math.floor(Math.random() * 40) + 50}%`
</script>

<div
  bind:this={ref}
  data-slot="sidebar-menu-skeleton"
  data-sidebar="menu-skeleton"
  class={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
  {...rest}
>
  {#if showIcon}
    <Skeleton class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
  {/if}
  <Skeleton
    class="h-4 max-w-(--skeleton-width) flex-1"
    data-sidebar="menu-skeleton-text"
    style="--skeleton-width: {width};"
  />
</div>
