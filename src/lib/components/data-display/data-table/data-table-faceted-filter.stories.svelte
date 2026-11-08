<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import DeviceTable from '../../../../../stories/fixtures/device-table.svelte'
  import { STATUS_OPTIONS } from '../../../../../stories/fixtures/devices.js'
  import DataTableFacetedFilter from './data-table-faceted-filter.svelte'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/FacetedFilter',
    component: DataTableFacetedFilter,
    tags: ['mise'],
  })
</script>

<!--
  A select-shaped pill over a searchable list, with a count beside each value
  from the rows the table holds. Choose several; the pill names one and counts
  more. The first row clears the filter.
-->
<Story name="Playground" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="Status"
        options={STATUS_OPTIONS}
      />
    {/snippet}
  </DeviceTable>
</Story>

<!-- `allLabel` where "All {title}" reads badly: an irregular plural, or a friendlier word. -->
<Story name="With all label" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="Status"
        allLabel="Any status"
        options={STATUS_OPTIONS}
      />
    {/snippet}
  </DeviceTable>
</Story>
