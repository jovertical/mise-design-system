<!--
  Origin: the React package 2.23.0 `readiness.tsx` (`ReadinessSummary`, `SummaryMessage`)
  Diverged: spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { ReadinessItem } from './readiness-summarise.js'

  /**
   * The count, the bar, and one line naming what is missing: naming it beats
   * reporting that something is.
   */
  export type ReadinessSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    items: ReadinessItem[]
    /**
     * Whether the thing is actually ready, when something other than this list
     * decides. Omit it and readiness is "every required item met", the only
     * authority a form has; pass it where a server owns the gate.
     */
    ready?: boolean
    readyMessage?: string
  }
</script>

<script lang="ts">
  import Progress from '../../feedback/progress/progress.svelte'
  import Text from '../../typography/text/text.svelte'
  import { summariseReadiness } from './readiness-summarise.js'

  let {
    items,
    ready,
    readyMessage = 'Everything required is done.',
    ...rest
  }: ReadinessSummaryProps = $props()

  const summary = $derived(summariseReadiness(items))
  const resolved = $derived(ready ?? summary.complete)
  // A caller can pass ready={false} with every row ticked: the gate is shut for
  // a reason this list does not know, and claiming readiness would be a lie.
  const message = $derived.by(() => {
    if (resolved) return readyMessage
    if (summary.blocking.length > 0)
      return `Still needed: ${summary.blocking.map((item) => item.label).join(', ')}.`
    if (summary.pending.length > 0)
      return `Waiting on: ${summary.pending.map((item) => item.label).join(', ')}.`
    return 'Not ready yet.'
  })
</script>

<div data-slot="readiness-summary" {...rest}>
  <div class="flex items-baseline justify-between gap-3">
    <span class="text-2xl font-semibold tabular-nums">
      {summary.met}<span class="text-muted-foreground text-base">/{summary.total}</span>
    </span>
    <Text size="sm" muted numeric>{summary.percent}% ready</Text>
  </div>
  <Progress
    value={summary.percent}
    class="mt-3"
    aria-label="{summary.met} of {summary.total} requirements met"
  />
  <p class="text-muted-foreground mt-3 text-xs">{message}</p>
</div>
