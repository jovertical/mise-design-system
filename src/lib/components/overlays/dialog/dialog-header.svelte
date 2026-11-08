<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogHeader`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DialogHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: DialogHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="dialog-header"
  class={cn('flex flex-col gap-2 text-center sm:text-left', className)}
  {...rest}
>
  {@render children?.()}
</div>
