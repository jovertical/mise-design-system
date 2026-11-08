<script lang="ts">
  import {
    DataTable,
    DataTableColumnToggle,
    DataTableExportMenu,
    type DataTableViewMode,
    DataTableViewToggle,
  } from '../../src/lib/index.js'
  import { DEVICES, deviceColumns } from '../../stories/fixtures/devices.js'

  let {
    onExportCsv,
    getCopyText,
    onPrint,
  }: { onExportCsv?: () => void; getCopyText?: () => string; onPrint?: () => void } = $props()

  let mode = $state<DataTableViewMode>('table')
</script>

{#snippet card(device: (typeof DEVICES)[number])}
  <article data-testid="card">{device.serial}</article>
{/snippet}

<DataTable columns={deviceColumns} data={DEVICES} viewMode={mode} {card}>
  {#snippet toolbar(table)}
    <DataTableViewToggle bind:value={mode} />
    <DataTableColumnToggle {table} />
    <DataTableExportMenu {onExportCsv} {getCopyText} {onPrint} />
  {/snippet}
</DataTable>
