<!--
  Origin: the React package 2.23.0 `stepper.tsx` (`StepChip`)
  Diverged: React's `tourTarget` is dropped (round 7 plan, R7-5). Not exported.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  /**
   * A step's contents, wrapped in whatever can carry a click: a div when the
   * stepper only reports progress (a button that does nothing is worse than
   * plain text), a button when the step can be selected.
   */
  export type StepperChipProps = {
    selectable: boolean
    onSelect: () => void
    name: string
    class?: string
    children: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { selectable, onSelect, name, class: className, children }: StepperChipProps = $props()
</script>

{#if selectable}
  <button
    type="button"
    onclick={onSelect}
    aria-label="Go to {name}"
    class={cn(
      'focus-visible:ring-ring/50 flex shrink-0 cursor-pointer items-start gap-3 rounded-2xl px-1 py-1 text-left transition-opacity outline-none hover:opacity-80 focus-visible:ring-[3px]',
      className,
    )}
  >
    {@render children()}
  </button>
{:else}
  <div class={cn('flex shrink-0 items-start gap-3', className)}>{@render children()}</div>
{/if}
