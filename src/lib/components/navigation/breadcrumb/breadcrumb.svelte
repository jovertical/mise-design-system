<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`Breadcrumb`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Written against shadcn/ui's `breadcrumb` API, not ported from it: the names
   * match so a reader arriving from shadcn finds what they expect. The separator
   * is `/` and the leaf is not a disabled link.
   */
  export type BreadcrumbProps = WithElementRef<HTMLAttributes<HTMLElement>, HTMLElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: BreadcrumbProps = $props()
</script>

<nav
  bind:this={ref}
  data-slot="breadcrumb"
  aria-label="Breadcrumb"
  class={cn('min-w-0', className)}
  {...rest}
>
  {@render children?.()}
</nav>
