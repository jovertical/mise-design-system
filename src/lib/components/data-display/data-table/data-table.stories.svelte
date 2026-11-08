<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import type { RowSelectionState } from '@tanstack/svelte-table'
  import {
    DEVICES,
    type Device,
    deviceColumns,
    STATUS_OPTIONS,
    STATUS_TONE,
  } from '../../../../../stories/fixtures/devices.js'
  import {
    deviceRowsOf,
    LOCATION_ROWS,
    locationColumns,
  } from '../../../../../stories/fixtures/locations.js'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import Empty from '../../feedback/empty/empty.svelte'
  import EmptyDescription from '../../feedback/empty/empty-description.svelte'
  import EmptyHeader from '../../feedback/empty/empty-header.svelte'
  import EmptyTitle from '../../feedback/empty/empty-title.svelte'
  import Input from '../../forms/input/input.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import Badge from '../badge/badge.svelte'
  import DataTable from './data-table.svelte'
  import DataTableToolbar from './data-table-toolbar.svelte'
  import DataTableViewToggle from './data-table-view-toggle.svelte'

  const { Story } = defineMeta({
    title: 'Data display/DataTable',
    component: DataTable,
    tags: ['mise'],
    parameters: { layout: 'fullscreen' },
  })

  const selection = $state<{ value: RowSelectionState }>({ value: {} })
  const view = $state<{ mode: 'table' | 'grid' }>({ mode: 'grid' })
</script>

{#snippet noDevices()}
  <Empty>
    <EmptyHeader>
      <EmptyTitle>No devices</EmptyTitle>
      <EmptyDescription>Pair a register to see it here.</EmptyDescription>
    </EmptyHeader>
  </Empty>
{/snippet}
{#snippet search()}
  <div class="flex items-center gap-2">
    <Input placeholder="Search devices" aria-label="Search devices" class="h-8 w-56" />
  </div>
{/snippet}
{#snippet viewAll()}
  <Button variant="ghost" size="sm">View all devices</Button>
{/snippet}

<!--
  A listing: a card holding the table and a closing strip that counts the rows.
  `args as object`: Storybook's untyped args cannot be spread over a component
  generic in its row type.
-->
<Story name="Playground">
  {#snippet template(args)}
    <div class="py-6">
      <DataTable {...args as object} columns={deviceColumns} data={DEVICES} />
    </div>
  {/snippet}
</Story>

<!--
  Loading draws skeleton rows and no closing strip: a count of nothing is not
  information. An empty table shows its empty state across every column.
-->
<Story name="States" asChild>
  <div class="py-6">
    <StoryAxis values={['loading', 'empty'] as const} orientation="vertical">
      {#snippet item(state)}
        <DataTable
          columns={deviceColumns}
          data={[] as Device[]}
          isLoading={state === 'loading'}
          emptyState={noDevices}
          withPadding={false}
        />
      {/snippet}
    </StoryAxis>
  </div>
</Story>

<!--
  `title` and `description` head the table from inside its own card, above the
  toolbar, so the heading and the rows read as one block. Table view only.
-->
<Story name="With title" asChild>
  <div class="py-6">
    <DataTable
      columns={deviceColumns}
      data={DEVICES}
      title="Devices across your locations"
      description="Every paired register and the location it rings up sales for."
      toolbar={search}
    />
  </div>
</Story>

<!--
  The toolbar sits inside the table card, above the header row: search and
  filters on the left, export and the column toggle on the right.
-->
<Story name="With toolbar" asChild>
  <div class="py-6">
    <DataTable columns={deviceColumns} data={DEVICES}>
      {#snippet toolbar(table)}
        <DataTableToolbar
          {table}
          search={{ placeholder: 'Search devices…' }}
          filters={[{ columnId: 'status', title: 'Status', options: STATUS_OPTIONS }]}
          exports={{ getCopyText: () => 'serial\tlocation\tstatus' }}
        />
      {/snippet}
    </DataTable>
  </div>
</Story>

<!--
  `footer` replaces the strip's contents: a dashboard's summary card wants one
  link out, not a count and a load-more it has no use for.
-->
<Story name="With footer" asChild>
  <div class="py-6">
    <DataTable columns={deviceColumns} data={DEVICES.slice(0, 3)} footer={viewAll} />
  </div>
</Story>

<!--
  Selection keys off `getRowId`; without it rows are keyed by index, and the
  selection survives neither a sort nor a page load. A register still pairing
  cannot be selected.
-->
<Story name="With row selection" asChild>
  <div class="py-6">
    <DataTable
      columns={deviceColumns}
      data={DEVICES}
      enableRowSelection
      getRowId={(device) => device.id}
      bind:rowSelection={selection.value}
      isRowSelectable={(device) => device.status !== 'pairing'}
    />
  </div>
</Story>

<!-- The closing strip: the count on the left, load-more centred, nothing on the right. -->
<Story name="Load more" asChild>
  <div class="py-6">
    <DataTable columns={deviceColumns} data={DEVICES} hasNextPage fetchNextPage={() => {}} />
  </div>
</Story>

<!--
  The same data as a grid of cards. The view toggle owns the mode; the toolbar
  sits above the grid, since there is no card to hold it.
-->
<Story name="Grid view" asChild>
  <div class="py-6">
    <DataTable
      columns={deviceColumns}
      data={DEVICES}
      viewMode={view.mode}
      getItemKey={(device) => device.id}
    >
      {#snippet toolbar()}
        <div class="flex items-center justify-end">
          <DataTableViewToggle bind:value={view.mode} />
        </div>
      {/snippet}
      {#snippet card(device)}
        <Card>
          <CardContent class="flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="font-heading text-sm">{device.serial}</span>
              <Badge tone={STATUS_TONE[device.status]}>{device.status}</Badge>
            </div>
            <span class="text-muted-foreground text-xs">{device.location}</span>
          </CardContent>
        </Card>
      {/snippet}
    </DataTable>
  </div>
</Story>

<!--
  A row that stands for several. `getSubRows` is the whole opt-in; the chevron,
  the indent and a collapsed row's summary are the cells' business. A location
  holding one device stays flat. `getRowId` is required: expansion is keyed by
  row id.
-->
<Story name="Expandable rows" asChild>
  <div class="py-6">
    <DataTable
      columns={locationColumns}
      data={LOCATION_ROWS}
      getSubRows={deviceRowsOf}
      getRowId={(row) => row.id}
      getRowClass={(row) => (row.kind === 'device' ? 'bg-muted/30' : undefined)}
    />
  </div>
</Story>
