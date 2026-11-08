<!--
  Origin: the React package 2.23.0 `breadcrumb.tsx` (`BreadcrumbList`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLOlAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type BreadcrumbListProps = WithElementRef<HTMLOlAttributes, HTMLOListElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: BreadcrumbListProps = $props()
</script>

<ol
  bind:this={ref}
  data-slot="breadcrumb-list"
  class={cn('text-muted-foreground flex min-w-0 items-center gap-2 text-sm', className)}
  {...rest}
>
  {@render children?.()}
</ol>
