<!--
  Story scaffolding, not a package export: the disclosure cell of the
  expandable-rows story. The chevron, the indent and the count are the cell's
  business, from what TanStack hands it.
-->
<script lang="ts">
  import type { Row } from '@tanstack/svelte-table'

  import type { DataTableFeatures } from '../../src/lib/components/data-display/data-table/features.js'
  import type { LocationRow } from './locations.js'

  let { row }: { row: Row<DataTableFeatures, LocationRow> } = $props()
</script>

{#if row.original.kind === 'device'}
  <span class="text-muted-foreground pl-6">{row.original.device.serial}</span>
{:else if row.getCanExpand()}
  <button
    type="button"
    onclick={row.getToggleExpandedHandler()}
    aria-expanded={row.getIsExpanded()}
    class="-mx-1 flex items-center gap-1.5 rounded px-1 text-left"
  >
    <span class="text-muted-foreground">{row.getIsExpanded() ? '▾' : '▸'}</span>
    <span class="font-medium">{row.original.location}</span>
    <span class="text-muted-foreground ml-1 text-xs tabular-nums">
      {row.original.devices.length}
      devices
    </span>
  </button>
{:else}
  <span class="font-medium">{row.original.location}</span>
{/if}
