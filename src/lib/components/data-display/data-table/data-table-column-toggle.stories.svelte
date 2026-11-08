<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import DeviceTable from '../../../../../stories/fixtures/device-table.svelte'
  import DataTableColumnToggle from './data-table-column-toggle.svelte'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/ColumnToggle',
    component: DataTableColumnToggle,
    tags: ['mise'],
  })
</script>

<!--
  It sits in the toolbar's right-hand cluster, beside export. The menu has the
  geometry of every menu in the package. The line below lists what is showing.
-->
<Story name="Playground" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <div class="flex items-center justify-between gap-4">
        <p class="text-muted-foreground text-sm">
          Showing:
          {table
            .getVisibleLeafColumns()
            .map((column) => column.id)
            .join(', ')}
        </p>
        <DataTableColumnToggle {table} />
      </div>
    {/snippet}
  </DeviceTable>
</Story>
