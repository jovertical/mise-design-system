<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineDot`)
  Diverged: `indicator` is a snippet.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { TimelineDotTone } from './timeline-variants.js'

  /**
   * The badge. Renders whatever icon it is given, and a small filled circle
   * when given nothing: an empty 32px disc reads as a component that failed to
   * load.
   */
  export type TimelineDotProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    tone?: TimelineDotTone
    /**
     * A mark on the badge's lower-right edge (a `PresenceDot` while that
     * entry's author is here now), drawn over the badge so the columns do not
     * move.
     */
    indicator?: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { timelineDotVariants } from './timeline-variants.js'

  let {
    ref = $bindable(null),
    tone,
    indicator,
    class: className,
    children,
    ...rest
  }: TimelineDotProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="timeline-dot"
  role="status"
  class={cn(timelineDotVariants({ tone }), indicator ? 'relative' : null, className)}
  {...rest}
>
  {#if children}
    {@render children()}
  {:else}
    <span class="size-2.5 rounded-full bg-current"></span>
  {/if}
  {#if indicator}
    <span class="absolute right-0 bottom-0 flex">{@render indicator()}</span>
  {/if}
</div>
