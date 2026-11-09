<!--
  Origin: mise
  Diverged: none. Board has no React origin; mise authored it for the
    logistics example's Orders board (2026-11-09).
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Columns of cards grouped by a status: a pipeline read across. Read-only;
   * moving a card between columns is the deferred drag-and-drop work. The row
   * scrolls sideways rather than squeezing its columns, because a card needs
   * its width to say anything.
   */
  export type BoardProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: BoardProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="board"
  class={cn('flex items-start gap-3 overflow-x-auto pb-2', className)}
  {...rest}
>
  {@render children?.()}
</div>
