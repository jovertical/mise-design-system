<!--
  Origin: the React package 2.23.0 `item.tsx` (`ItemGroup`), itself shadcn/ui new-york `item`
  Svelte: shadcn-svelte `item`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * A list of `Item` rows. `flex flex-col` with no gap: rows that share a field
   * touch, and a group of outlined rows takes `gap-2` so two borders do not
   * meet as an accidental 2px rule.
   */
  export type ItemGroupProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ItemGroupProps = $props()
</script>

<!-- biome-ignore lint/a11y/useSemanticElements: upstream shadcn markup. The element is a styling wrapper carrying a role for grouping, not a landmark, and no semantic element covers it -->
<div
  bind:this={ref}
  role="list"
  data-slot="item-group"
  class={cn('group/item-group flex flex-col', className)}
  {...rest}
>
  {@render children?.()}
</div>
