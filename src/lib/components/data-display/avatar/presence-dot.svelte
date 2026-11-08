<!--
  Origin: the React package 2.23.0 `avatar.tsx` (`PresenceDot`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The live "here now" mark: an 8px success dot, ringed in the card colour so
   * it separates from whatever it sits on, with a ping so it reads as live
   * rather than as a status colour. On its own so it can sit on any edge.
   */
  export type PresenceDotProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    /** Read to screen readers, e.g. "Has this ticket open". */
    label?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), label, class: className, ...rest }: PresenceDotProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="presence-dot"
  class={cn('relative flex size-2', className)}
  {...rest}
>
  <span
    aria-hidden="true"
    class="bg-success absolute inline-flex size-full animate-ping rounded-full opacity-60"
  ></span>
  <span class="bg-success ring-card relative inline-flex size-2 rounded-full ring-2">
    {#if label}
      <span class="sr-only">{label}</span>
    {/if}
  </span>
</span>
