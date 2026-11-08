<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbSeparator`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLLiAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * `/` rather than a chevron; pass children for a different mark.
   */
  export type BreadcrumbSeparatorProps = WithElementRef<HTMLLiAttributes, HTMLLIElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: BreadcrumbSeparatorProps = $props()
</script>

<li
  bind:this={ref}
  data-slot="breadcrumb-separator"
  aria-hidden="true"
  class={cn('shrink-0 select-none', className)}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    /
  {/if}
</li>
