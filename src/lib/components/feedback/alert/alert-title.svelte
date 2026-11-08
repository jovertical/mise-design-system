<!--
  Origin: the React package 2.23.0 `alert.tsx` (`AlertTitle`), itself shadcn/ui new-york `alert`
  Svelte: shadcn-svelte `alert`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * One clamped line: anything that needs a second line belongs in the description.
   */
  export type AlertTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: AlertTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-title"
  class={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
  {...rest}
>
  {@render children?.()}
</div>
