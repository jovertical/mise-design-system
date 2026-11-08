<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetHeader`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SheetHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: SheetHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="sheet-header"
  class={cn('flex flex-col gap-1.5 p-4', className)}
  {...rest}
>
  {@render children?.()}
</div>
