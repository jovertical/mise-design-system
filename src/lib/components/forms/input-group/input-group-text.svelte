<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroupText`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** A fixed unit or symbol rather than an interactive addon. */
  export type InputGroupTextProps = WithElementRef<HTMLAttributes<HTMLSpanElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: InputGroupTextProps = $props()
</script>

<span
  bind:this={ref}
  class={cn(
    "text-muted-foreground flex items-center gap-2 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</span>
