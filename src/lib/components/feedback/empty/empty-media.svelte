<!--
  Origin: the React package 2.23.0 `empty.tsx` (`EmptyMedia`), itself shadcn/ui new-york `empty`
  Svelte: shadcn-svelte `empty`
  Diverged: none beyond the port. The React divergences from shadcn carry over.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { EmptyMediaVariant } from './empty-variants.js'

  /**
   * `icon` is a ringed circle on the page's own surface rather than a filled
   * square: a frame around the glyph, which keeps a large empty panel from
   * looking like a broken card.
   */
  export type EmptyMediaProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: EmptyMediaVariant
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { emptyMediaVariants } from './empty-variants.js'

  let {
    ref = $bindable(null),
    variant = 'default',
    class: className,
    children,
    ...rest
  }: EmptyMediaProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="empty-icon"
  data-variant={variant}
  class={cn(emptyMediaVariants({ variant }), className)}
  {...rest}
>
  {@render children?.()}
</div>
