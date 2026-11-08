<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogFooter`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type DialogFooterProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: DialogFooterProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="dialog-footer"
  class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
  {...rest}
>
  {@render children?.()}
</div>
