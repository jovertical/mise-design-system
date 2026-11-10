<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconTrash from '@tabler/icons-svelte-runes/icons/trash'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'
  import { createRawSnippet } from 'svelte'

  import DeviceActions from '../../../../../stories/fixtures/device-actions.svelte'
  import { DEVICES, deviceColumns } from '../../../../../stories/fixtures/devices.js'
  import DropdownMenuItem from '../../actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuSeparator from '../../actions/dropdown-menu/dropdown-menu-separator.svelte'
  import DataTable from './data-table.svelte'
  import DataTableRowActions from './data-table-row-actions.svelte'
  import { dataTableColumns } from './features.js'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/RowActions',
    component: DataTableRowActions,
    tags: ['mise'],
  })

  const column = dataTableColumns<(typeof DEVICES)[number]>()

  const hiddenHeading = createRawSnippet(() => ({
    render: () => '<span class="sr-only">Actions</span>',
  }))

  const columnsWithActions = [
    ...deviceColumns,
    column.display({
      id: 'actions',
      header: () => renderSnippet(hiddenHeading),
      cell: ({ row }) => renderComponent(DeviceActions, { serial: row.original.serial }),
    }),
  ]

  const clicks = $state({ count: 0 })
</script>

<!--
  The trigger on its own: a soft, neutral chip that dims on hover and while
  open. `args as object`: the args carry `children`, which the story sets.
-->
<Story name="Playground">
  {#snippet template(args)}
    <div class="flex w-48 justify-end">
      <DataTableRowActions label="Actions for RG-0041" {...args as object}>
        <DropdownMenuItem><IconPencil />Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="critical"><IconTrash />Unpair</DropdownMenuItem>
      </DataTableRowActions>
    </div>
  {/snippet}
</Story>

<!--
  `disabled` for a row that can take no action, such as a built-in role. The
  trigger stays, so the column keeps its rhythm, and `label` says why.
-->
<Story name="States" asChild>
  <div class="flex w-48 justify-end">
    <DataTableRowActions label="Read-only role" disabled>
      <DropdownMenuItem><IconPencil />Edit</DropdownMenuItem>
    </DataTableRowActions>
  </div>
</Story>

<!--
  In the last column of a table whose rows navigate. Click a row and the count
  goes up; open a row's menu, or pick an item in it, and it does not.
-->
<Story name="In a table" asChild>
  <div class="flex flex-col gap-2 py-6">
    <p class="text-muted-foreground px-6 text-sm">Row clicks: {clicks.count}</p>
    <DataTable
      columns={columnsWithActions}
      data={DEVICES}
      getRowId={(device) => device.id}
      onRowClick={() => clicks.count++}
    />
  </div>
</Story>
