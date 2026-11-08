<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbItem`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLLiAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * `min-w-0` so a long crumb can truncate rather than push the trail past the
   * edge. Crumbs that must never shrink (the root, the leaf) say so with `shrink-0`.
   */
  export type BreadcrumbItemProps = WithElementRef<HTMLLiAttributes, HTMLLIElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: BreadcrumbItemProps = $props()
</script>

<li
  bind:this={ref}
  data-slot="breadcrumb-item"
  class={cn('flex min-w-0 items-center gap-2', className)}
  {...rest}
>
  {@render children?.()}
</li>
