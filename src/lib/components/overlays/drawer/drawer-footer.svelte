<!--
  Origin: the React package 2.23.0 `drawer.tsx` (`DrawerFooter`), itself shadcn/ui new-york `drawer`
  Svelte: shadcn-svelte `drawer`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DrawerFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: DrawerFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="drawer-footer"
  class={cn('mt-auto flex flex-col gap-2 p-4', className)}
  {...rest}
>
  {@render children?.()}
</div>
