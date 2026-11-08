<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbPage`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The leaf. Not a link, because it points at where you already are:
   * `aria-current="page"` on plain text, not a link that refuses to be followed.
   */
  export type BreadcrumbPageProps = WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: BreadcrumbPageProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="breadcrumb-page"
  aria-current="page"
  class={cn('text-foreground truncate', className)}
  {...rest}
>
  {@render children?.()}
</span>
