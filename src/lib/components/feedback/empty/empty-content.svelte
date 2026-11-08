<!--
  Origin: the React package 2.23.0 `empty.tsx` (`EmptyContent`), itself shadcn/ui new-york `empty`
  Svelte: shadcn-svelte `empty`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type EmptyContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: EmptyContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="empty-content"
  class={cn(
    'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
