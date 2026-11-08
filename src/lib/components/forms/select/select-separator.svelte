<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectSeparator`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: a plain div: bits-ui Select has no separator part.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type SelectSeparatorProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SelectSeparatorProps = $props()
</script>

<div
  bind:this={ref}
  role="none"
  data-slot="select-separator"
  class={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
  {...rest}
></div>
