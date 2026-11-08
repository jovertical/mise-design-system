<!--
  Origin: the React package 2.23.0 `button-group.tsx` (`ButtonGroupText`), itself shadcn/ui new-york `button-group`
  Svelte: shadcn-svelte `button-group`
  Diverged: `asChild` is a `child` snippet that receives the merged props. Carries
    `data-slot="button-group-text"`, which React's lacks.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** A fixed label inside a group: a unit, a prefix, a caption ahead of an action. */
  export type ButtonGroupTextProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    child?: Snippet<[{ props: Record<string, unknown> }]>
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    child,
    children,
    ...rest
  }: ButtonGroupTextProps = $props()

  const merged = $derived({
    ...rest,
    'data-slot': 'button-group-text',
    class: cn(
      "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      className,
    ),
  })
</script>

{#if child}
  {@render child({ props: merged })}
{:else}
  <div bind:this={ref} {...merged}>
    {@render children?.()}
  </div>
{/if}
