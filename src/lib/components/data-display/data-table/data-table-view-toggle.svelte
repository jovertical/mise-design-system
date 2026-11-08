<!--
  Origin: the React package 2.23.0 `data-table-view-toggle.tsx`
  Diverged: `bind:value` for React's `value` and `onChange`. Lucide's table and
    layout-grid for Tabler's.
-->
<script lang="ts" module>
  import type { DataTableViewMode } from './features.js'

  /**
   * Table or grid, as a segmented control of two glyphs. The cells are square
   * rather than the segmented default's pill: a pill wider than its icon reads
   * as a button missing its label.
   */
  export type DataTableViewToggleProps = { value: DataTableViewMode }
</script>

<script lang="ts">
  import LayoutGridIcon from '@lucide/svelte/icons/layout-grid'
  import TableIcon from '@lucide/svelte/icons/table'

  import ToggleGroup from '../../forms/toggle-group/toggle-group.svelte'
  import ToggleGroupItem from '../../forms/toggle-group/toggle-group-item.svelte'

  let { value = $bindable('table') }: DataTableViewToggleProps = $props()

  /** Clicking the chosen cell again clears a single toggle group; keep the mode instead. */
  function choose(mode: string) {
    if (mode) value = mode as DataTableViewMode
  }
</script>

<ToggleGroup type="single" variant="segmented" aria-label="View" bind:value={() => value, choose}>
  <ToggleGroupItem value="table" aria-label="Table view" class="size-6 flex-none px-0">
    <TableIcon class="size-4" />
  </ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid view" class="size-6 flex-none px-0">
    <LayoutGridIcon class="size-4" />
  </ToggleGroupItem>
</ToggleGroup>
