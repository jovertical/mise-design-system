<!--
  Origin: the React package 2.23.0 `empty.tsx` (`EmptyTitle`), itself shadcn/ui new-york `empty`
  Svelte: shadcn-svelte `empty`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type EmptyTitleProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: EmptyTitleProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="empty-title"
  class={cn('font-heading text-base font-medium', className)}
  {...rest}
>
  {@render children?.()}
</div>
