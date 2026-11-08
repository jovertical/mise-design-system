<script module lang="ts">
  import UploadIcon from '@lucide/svelte/icons/upload'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import DeviceTable from '../../../../../stories/fixtures/device-table.svelte'
  import { STATUS_OPTIONS } from '../../../../../stories/fixtures/devices.js'
  import Button from '../../actions/button/button.svelte'
  import DataTableToolbar from './data-table-toolbar.svelte'
  import type { DataTableViewMode } from './features.js'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/Toolbar',
    component: DataTableToolbar,
    tags: ['mise'],
  })

  const LOCATION_OPTIONS = [
    { label: 'Riverside', value: 'Riverside' },
    { label: 'Harbour', value: 'Harbour' },
    { label: 'North yard', value: 'North yard' },
  ]

  const statusFilter = { columnId: 'status', title: 'Status', options: STATUS_OPTIONS }
  const locationFilter = { columnId: 'location', title: 'Location', options: LOCATION_OPTIONS }

  const view = $state<{ mode: DataTableViewMode }>({ mode: 'table' })
</script>

<!--
  The whole row: what narrows the table on the left, what acts on it on the
  right. Search and filters decide which rows; export, clear and the column
  toggle decide what happens to them. The counts beside each option are the
  real distribution of the loaded rows.
-->
<Story name="Playground" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search devices…' }}
        filters={[statusFilter, locationFilter]}
      />
    {/snippet}
  </DeviceTable>
</Story>

<!--
  `leading` and `actions` follow the same split. A location scope or a date
  range goes in `leading`: it changes which rows you see. An import link goes in
  `actions`: it is something you do.
-->
<Story name="With extras" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search devices…' }}
        filters={[statusFilter]}
        exports={{ getCopyText: () => 'serial\tlocation\nRG-0041\tRiverside' }}
      >
        {#snippet actions()}
          <Button
            variant="ghost"
            class="bg-input/50 hover:bg-input h-8 gap-1.5 rounded-2xl border border-transparent px-3 text-sm font-normal"
          >
            <UploadIcon class="size-4" />
            Import
          </Button>
        {/snippet}
      </DataTableToolbar>
    {/snippet}
  </DeviceTable>
</Story>

<!--
  A listing that offers a grid binds its mode here. The column toggle hides in
  grid view: there are no columns on screen to toggle.
-->
<Story name="With view toggle" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableToolbar
        {table}
        search={{ placeholder: 'Search devices…' }}
        filters={[statusFilter]}
        bind:viewMode={view.mode}
      />
    {/snippet}
  </DeviceTable>
</Story>

<!--
  Several values chosen at once; the line below is the column filters the table
  now holds, updating with each pick.
-->
<Story name="Multiple selections" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <div class="flex flex-col gap-3">
        <DataTableToolbar
          {table}
          search={{ placeholder: 'Search devices…' }}
          filters={[statusFilter]}
        />
        <p class="text-muted-foreground text-xs">
          selected: {JSON.stringify(table.store.get().columnFilters)}
        </p>
      </div>
    {/snippet}
  </DeviceTable>
</Story>

<!-- No `search`, for a table with nothing worth searching: a ledger, a feed. -->
<Story name="No search" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <DataTableToolbar {table} filters={[statusFilter, locationFilter]} />
    {/snippet}
  </DeviceTable>
</Story>
