<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarInset`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SidebarInsetProps = WithElementRef<HTMLAttributes<HTMLElement>, HTMLElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SidebarInsetProps = $props()
</script>

<main
  bind:this={ref}
  data-slot="sidebar-inset"
  data-sidebar="inset"
  class={cn(
    'bg-muted relative flex w-full flex-1 flex-col',
    'group-data-[mobile=false]/sidebar-wrapper:peer-data-[variant=inset]:m-2 group-data-[mobile=false]/sidebar-wrapper:peer-data-[variant=inset]:ml-0 group-data-[mobile=false]/sidebar-wrapper:peer-data-[variant=inset]:rounded-xl group-data-[mobile=false]/sidebar-wrapper:peer-data-[variant=inset]:shadow-sm group-data-[mobile=false]/sidebar-wrapper:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</main>
