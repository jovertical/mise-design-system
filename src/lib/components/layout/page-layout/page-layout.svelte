<!--
  Origin: the React package 2.23.0 `page-layout.tsx`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The padded column every routed page sits in, so the gutter and the vertical
   * rhythm are decided once rather than per route.
   */
  export type PageLayoutProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: PageLayoutProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="page-layout"
  class={cn('flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 lg:px-6', className)}
  {...rest}
>
  {@render children?.()}
</div>
