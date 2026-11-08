<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerHeader`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DrawerHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: DrawerHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="drawer-header"
  class={cn(
    'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
