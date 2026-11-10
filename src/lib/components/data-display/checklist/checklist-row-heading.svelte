<!--
  Origin: the React package 2.23.0 `task-checklist.tsx` (`TaskRowHeading`, `TaskStateIcon`), with `checklist-card.tsx`'s row
  Diverged: one part for both components' rows (round 8 plan, R8-4): the icon,
    the state a screen reader hears, and the truncating label. ChecklistCard's
    `done` reads as `completed` and is announced "Completed:"/"Not started:",
    where React's said "Done:"/"Not done:". Not exported.
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
  import IconCircleCheckFilled from '@tabler/icons-svelte-runes/icons/circle-check-filled'
  import IconCircleDashed from '@tabler/icons-svelte-runes/icons/circle-dashed'
  import IconCircleMinus from '@tabler/icons-svelte-runes/icons/circle-minus'

  import { cn } from '../../../utils/cn.js'
  import { CHECKLIST_STATE_LABEL } from './checklist-types.js'

  let { state, label, size = 'md' }: ChecklistRowHeadingProps = $props()

  const iconSize = $derived(size === 'sm' ? 'size-3.5' : 'size-4')
</script>

{#if state === 'completed'}
  <IconCircleCheckFilled aria-hidden="true" class={cn('text-success shrink-0', iconSize)} />
{:else if state === 'skipped'}
  <IconCircleMinus aria-hidden="true" class={cn('text-muted-foreground shrink-0', iconSize)} />
{:else}
  <IconCircleDashed aria-hidden="true" class={cn('text-muted-foreground shrink-0', iconSize)} />
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
