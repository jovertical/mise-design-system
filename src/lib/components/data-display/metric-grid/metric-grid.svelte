<!--
  Origin: the React package 2.23.0 `metric-grid.tsx`
  Diverged: an item's `label`, `value`, `description` and `trailing` take a
    string or a snippet, as R4-5 has a ReactNode prop. Takes `class` and spreads
    the rest onto the grid, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'

  export type MetricGridItem = {
    /** Stable across renders; a translated label is not. */
    id: string
    label: string | Snippet
    /** How full this cell's bar is, 0–100. */
    percent: number
    value?: string | number | Snippet
    description?: string | Snippet
    /** Beside the bar: a percentage, a count, a unit. */
    trailing?: string | Snippet
    tone?: Tone
  }

  /**
   * A breakdown as a grid of bordered cells rather than a list of rows. A
   * reader comparing sub-groups against each other wants them adjacent, not in
   * order; `CardList` is the shape when the order means something.
   *
   * Each cell is a `MetricBar`, and this does not relitigate it: a caller
   * wanting other cell content wants `CardGrid` directly.
   */
  export type MetricGridProps = HTMLAttributes<HTMLDivElement> & {
    items: MetricGridItem[]
    /**
     * Columns at `md` and up; one below, where two cells side by side leave no
     * room for a label and a bar. The caller picks it, knowing how many items
     * there are: three columns and four items leaves an orphan.
     */
    columns?: 2 | 3
  }
</script>

<script lang="ts">
  import CardGrid from '../../layout/card-grid/card-grid.svelte'
  import CardGridCell from '../../layout/card-grid/card-grid-cell.svelte'
  import MetricBar from '../metric-bar/metric-bar.svelte'

  let { items, columns = 3, ...rest }: MetricGridProps = $props()
</script>

<CardGrid {columns} {...rest}>
  {#each items as item (item.id)}
    <CardGridCell>
      <MetricBar
        label={item.label}
        percent={item.percent}
        value={item.value}
        description={item.description}
        trailing={item.trailing}
        tone={item.tone}
      />
    </CardGridCell>
  {/each}
</CardGrid>
