<!--
  Origin: the React package 2.23.0 `card.tsx` (`CardContent`), itself shadcn/ui new-york `card`
  Svelte: shadcn-svelte `card`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export const CONTENT_STACK_CLASS = {
    sm: 'flex flex-col gap-3',
    md: 'flex flex-col gap-4',
    lg: 'flex flex-col gap-6',
  } as const

  /**
   * `stack` turns on a vertical flex with a gap, for content that is several
   * blocks rather than one. Off by default: `CardContent` stays a plain block,
   * which is right for one child. `sm` / `md` / `lg` name the three gaps
   * cards actually reach for, so the choice is made once, here.
   */
  export type CardContentProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    stack?: keyof typeof CONTENT_STACK_CLASS
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    stack,
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CardContentProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="card-content"
  data-stack={stack}
  class={cn('px-(--card-spacing)', stack && CONTENT_STACK_CLASS[stack], className)}
  {...rest}
>
  {@render children?.()}
</div>
