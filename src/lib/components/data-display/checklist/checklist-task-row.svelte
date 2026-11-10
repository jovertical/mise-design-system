<!--
  Origin: the React package 2.23.0 `task-checklist.tsx` (`TaskChecklistRow`)
  Diverged: bits-ui Collapsible for Radix's. Not exported.
-->
<script lang="ts" module>
  import type { ChecklistTask } from './checklist-types.js'

  export type ChecklistTaskRowProps = {
    task: ChecklistTask
    open: boolean
    onExpandedChange?: (id: string | null) => void
  }
</script>

<script lang="ts">
  import IconChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down'
  import { Collapsible as CollapsiblePrimitive } from 'bits-ui'

  import { cn } from '../../../utils/cn.js'
  import CollapsibleContent from '../../layout/collapsible/collapsible-content.svelte'
  import CollapsibleTrigger from '../../layout/collapsible/collapsible-trigger.svelte'
  import Hint from '../../overlays/hint/hint.svelte'
  import ChecklistRowHeading from './checklist-row-heading.svelte'

  let { task, open, onExpandedChange }: ChecklistTaskRowProps = $props()

  const hasBody = $derived(Boolean(task.description || task.media || task.learnMore))

  const focusRing =
    'focus-visible:border-ring focus-visible:ring-ring/50 rounded-md outline-none focus-visible:ring-[3px]'
</script>

{#snippet trailing()}
  <!-- Sized to its own content, so the Hint reads as attached to the title; the
       spacer after it pushes the actions to the row's far side. -->
  {#if task.hint}
    <Hint>{@render task.hint()}</Hint>
  {/if}
  <div class="min-w-0 flex-1"></div>
  {#if task.actions}
    <div class="shrink-0 text-sm">{@render task.actions()}</div>
  {/if}
{/snippet}

{#if !hasBody}
  <!-- A row with nothing to reveal is not a disclosure, so it does not render
       as one: no chevron that does nothing, no aria-controls pointing nowhere. -->
  <!-- biome-ignore lint/a11y/useSemanticElements: CardList is a div, so full-bleed rules can cancel the card padding; a ul or li there would take the rules off the edges, and role list/listitem is the ARIA equivalent -->
  <div data-slot="checklist-task" role="listitem" class="flex items-center gap-2">
    <div class="flex min-w-0 items-center gap-2 text-sm">
      <ChecklistRowHeading state={task.state} label={task.label} />
    </div>
    {@render trailing()}
  </div>
{:else}
  <!-- Controlled by the caller's `expandedId`, so the open row and the URL
       fragment are the same fact. Closing reports null. -->
  <!-- biome-ignore lint/a11y/useSemanticElements: CardList is a div, so full-bleed rules can cancel the card padding; a ul or li there would take the rules off the edges, and role list/listitem is the ARIA equivalent -->
  <CollapsiblePrimitive.Root
    data-slot="checklist-task"
    role="listitem"
    {open}
    onOpenChange={(next) => onExpandedChange?.(next ? task.id : null)}
  >
    <div class="flex items-center gap-2">
      <CollapsibleTrigger
        class={cn('flex min-w-0 items-center gap-2 text-left text-sm', focusRing)}
      >
        <ChecklistRowHeading state={task.state} label={task.label} />
      </CollapsibleTrigger>
      {@render trailing()}
      <!-- A second trigger for the same row, in its far corner past the
           actions; one control for a screen reader, two places to reach it. -->
      <CollapsibleTrigger
        class={cn('shrink-0', focusRing)}
        aria-label={open ? 'Collapse' : 'Expand'}
      >
        <IconChevronDown
          aria-hidden="true"
          class={cn(
            'text-muted-foreground size-4 shrink-0 transition-transform',
            open && 'rotate-180',
          )}
        />
      </CollapsibleTrigger>
    </div>
    <CollapsibleContent>
      <!-- Indented past the status icon, so the body hangs under the label. -->
      <div class="flex flex-col gap-3 pt-3 pl-6 text-sm">
        {#if task.description}
          <p class="text-muted-foreground">{task.description}</p>
        {/if}
        {#if task.media}
          <div>{@render task.media()}</div>
        {/if}
        {#if task.learnMore}
          <div>{@render task.learnMore()}</div>
        {/if}
      </div>
    </CollapsibleContent>
  </CollapsiblePrimitive.Root>
{/if}
