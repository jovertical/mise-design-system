<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardDescription`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type CardDescriptionProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardDescriptionProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-description"
  class={cn('text-muted-foreground text-sm', className)}
  {...rest}
>
  {@render children?.()}
</div>
