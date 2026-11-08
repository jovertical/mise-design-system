<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { FlexRender } from '@tanstack/svelte-table'
  import DeviceTable from '../../../../../stories/fixtures/device-table.svelte'
  import Table from '../table/table.svelte'
  import TableBody from '../table/table-body.svelte'
  import TableCell from '../table/table-cell.svelte'
  import TableHead from '../table/table-head.svelte'
  import TableHeader from '../table/table-header.svelte'
  import TableRow from '../table/table-row.svelte'
  import DataTableColumnHeader from './data-table-column-header.svelte'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/ColumnHeader',
    component: DataTableColumnHeader,
    tags: ['mise'],
  })
</script>

<!--
  A sortable header and an unsortable one look the same. "Last seen" is plain
  text; the three beside it open a sort menu. Nothing at rest says which is
  which; the affordance appears on hover.
-->
<Story name="Playground" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <div class="bg-card rounded-[min(var(--radius-4xl),24px)] border">
        <Table>
          <TableHeader>
            <TableRow>
              {#each table.getHeaderGroups()[0]?.headers ?? [] as header (header.id)}
                <TableHead><FlexRender {header} /></TableHead>
              {/each}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colspan={4} class="text-muted-foreground text-sm">
                Rows left out: this story is about the header row.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    {/snippet}
  </DeviceTable>
</Story>

<!-- On its own, out of a table, so the control itself is legible. -->
<Story name="Bare" asChild>
  <DeviceTable>
    {#snippet children(table)}
      <div class="flex items-center gap-8">
        {#each ['serial', 'location'] as id (id)}
          {@const column = table.getColumn(id)}
          {#if column}
            <DataTableColumnHeader {column} title={id === 'serial' ? 'Serial' : 'Location'} />
          {/if}
        {/each}
      </div>
    {/snippet}
  </DeviceTable>
</Story>
