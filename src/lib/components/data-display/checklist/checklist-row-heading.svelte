<!--
  Origin: the React package 2.23.0 `task-checklist.tsx` (`TaskRowHeading`, `TaskStateIcon`), with `checklist-card.tsx`'s row
  Diverged: one part for both components' rows (round 8 plan, R8-4): the icon,
    the state a screen reader hears, and the truncating label. ChecklistCard's
    `done` reads as `completed` and is announced "Completed:"/"Not started:",
    where React's said "Done:"/"Not done:". Lucide's circle-check, filled by
    class, for Tabler's filled check; circle-dashed and circle-minus. Not
    exported.
-->
<script lang="ts" module>
  import type { ChecklistTaskState } from './checklist-types.js'

  export type ChecklistRowHeadingProps = {
    state: ChecklistTaskState
    label: string
    /** `sm` for ChecklistCard's small size. */
    size?: 'sm' | 'md'
  }
</script>

<script lang="ts">
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check'
  import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed'
  import CircleMinusIcon from '@lucide/svelte/icons/circle-minus'

  import { cn } from '../../../utils/cn.js'
  import { CHECKLIST_STATE_LABEL } from './checklist-types.js'

  let { state, label, size = 'md' }: ChecklistRowHeadingProps = $props()

  const iconSize = $derived(size === 'sm' ? 'size-3.5' : 'size-4')
</script>

{#if state === 'completed'}
  <!-- Filled: the circle takes the colour and the check is cut out of it. -->
  <CircleCheckIcon
    aria-hidden="true"
    class={cn('text-success fill-current shrink-0 [&_path]:text-background', iconSize)}
  />
{:else if state === 'skipped'}
  <CircleMinusIcon aria-hidden="true" class={cn('text-muted-foreground shrink-0', iconSize)} />
{:else}
  <CircleDashedIcon aria-hidden="true" class={cn('text-muted-foreground shrink-0', iconSize)} />
{/if}

<!-- The state is a glyph and a colour, and neither reaches a screen reader. -->
<span class="sr-only">{CHECKLIST_STATE_LABEL[state]}</span>

<!-- `title` because the row truncates, and a long step name has no other way
     to be read. -->
<span
  title={label}
  class={cn('min-w-0 flex-1 truncate', state !== 'pending' && 'text-muted-foreground')}
>
  {label}
</span>
