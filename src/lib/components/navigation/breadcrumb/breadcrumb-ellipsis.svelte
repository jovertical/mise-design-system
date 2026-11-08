<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbEllipsis`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Stands in for crumbs dropped from the middle of a long trail.
   */
  export type BreadcrumbEllipsisProps = WithElementRef<
    HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  >
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: BreadcrumbEllipsisProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="breadcrumb-ellipsis"
  aria-hidden="true"
  class={cn('shrink-0 select-none', className)}
  {...rest}
>
  …<span class="sr-only">More</span>
</span>
