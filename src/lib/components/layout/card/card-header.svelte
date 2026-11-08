<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardHeader`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The two explicit row tracks appear only when a `CardAction` is present.
   * Upstream declares them unconditionally, so a title-only header carried an
   * empty second track and its gutter. `auto-rows-min` already makes as many
   * rows as there are children.
   *
   * `divided` draws the rule under the header. It is `border-b`, spelled as a
   * prop rather than a class a caller has to already know works.
   */
  export type CardHeaderProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    divided?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    divided = false,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardHeaderProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-header"
  class={cn(
    '@container/card-header grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-action]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
    divided && 'border-b',
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
