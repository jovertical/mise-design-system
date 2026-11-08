<!--
  Origin: the React package 2.23.0 `alert.tsx` (`AlertDescription`), itself shadcn/ui new-york `alert`
  Svelte: shadcn-svelte `alert`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A block rather than a grid: as a grid, an inline `<strong>` became its own row.
   */
  export type AlertDescriptionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: AlertDescriptionProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="alert-description"
  class={cn(
    'text-muted-foreground col-start-2 text-sm [&_p]:leading-relaxed [&>p+p]:mt-2 [&>ul]:mt-1 [&_b]:text-foreground [&_strong]:text-foreground',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
