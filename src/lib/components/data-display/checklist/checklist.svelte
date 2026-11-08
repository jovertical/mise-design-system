<!--
  Origin: the React package 2.23.0 `task-checklist.tsx` (`TaskChecklist`)
  Diverged: React's TaskChecklist, renamed Checklist in the checklist family
    (round 8 plan, R8-4): "Task" said nothing the list does not. Its rows share
    the family's row heading with ChecklistCard. Spreads the rest onto the
    root, as every component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { ChecklistGroup } from './checklist-types.js'

  /**
   * The full "Get started" list: setup steps grouped into cards, each row
   * folding open to its description and whatever the caller hangs off it.
   *
   * The page-sized companion to `ChecklistCard`, which lives above a sidebar's
   * nav and shows the next few rows of one flat list. Not `Readiness`, which
   * answers "what does this page still need before I can save it".
   */
  export type ChecklistProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    groups: ChecklistGroup[]
    /**
     * The `id` of the one open row, or nothing open. Controlled, with no
     * internal fallback, so it can follow a URL fragment without disagreeing
     * with it. One row at a time by construction.
     */
    expandedId?: string
    /** The id to move to, or `null` when the open row was closed. */
    onExpandedChange?: (id: string | null) => void
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Progress from '../../feedback/progress/progress.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import CardList from '../../layout/card-list/card-list.svelte'
  import ChecklistTaskRow from './checklist-task-row.svelte'

  let { groups, expandedId, onExpandedChange, class: className, ...rest }: ChecklistProps = $props()

  const bound = (percent: number) => Math.min(100, Math.max(0, percent))
</script>

<div data-slot="checklist" class={cn('flex flex-col gap-4', className)} {...rest}>
  {#each groups as group (group.key)}
    {@const percent = bound(group.percent)}
    {@const shown = Math.round(percent)}
    <Card>
      <CardHeader class="gap-3">
        <CardTitle class="justify-between">
          <span title={group.label} class="min-w-0 truncate">{group.label}</span>
          <span class="text-muted-foreground shrink-0 text-sm font-normal tabular-nums"
            >{shown}%</span
          >
        </CardTitle>
        <!-- The name carries the share as well as the group: the bar is the
             sighted reading, the name the whole reading for everyone else. -->
        <Progress value={percent} aria-label="{group.label}: {shown}% complete" />
      </CardHeader>
      {#if group.tasks.length > 0}
        <CardContent>
          <!-- compact: every row is one line until a reader opens it. -->
          <!-- biome-ignore lint/a11y/useSemanticElements: CardList is a div, so full-bleed rules can cancel the card padding; a ul or li there would take the rules off the edges, and role list/listitem is the ARIA equivalent -->
          <CardList compact role="list">
            {#each group.tasks as task (task.id)}
              <ChecklistTaskRow {task} open={task.id === expandedId} {onExpandedChange} />
            {/each}
          </CardList>
        </CardContent>
      {/if}
    </Card>
  {/each}
</div>
