<!--
  Origin: the React package 2.23.0 `avatar.tsx` (`AvatarStatus`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * An avatar with a `PresenceDot` on its edge while someone is here. It wraps
   * an `Avatar` rather than sitting inside it: `Avatar` clips its children to a
   * circle, and the dot has to overhang the edge to read as a badge.
   */
  export type AvatarStatusProps = WithElementRef<HTMLAttributes<HTMLSpanElement>> & {
    /** Shows the dot: someone is here right now. */
    isOnline: boolean
    /** Read to screen readers while online, e.g. "Has this ticket open". */
    label?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import PresenceDot from './presence-dot.svelte'

  let {
    ref = $bindable(null),
    isOnline,
    label,
    class: className,
    children,
    ...rest
  }: AvatarStatusProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="avatar-status"
  data-online={isOnline || undefined}
  class={cn('relative inline-flex shrink-0', className)}
  {...rest}
>
  {@render children?.()}
  {#if isOnline}
    <PresenceDot {label} class="absolute right-0 bottom-0" />
  {/if}
</span>
