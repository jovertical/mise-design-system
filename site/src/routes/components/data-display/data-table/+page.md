---
title: DataTable
description: A listing, as a card holding a title, a toolbar, the table and a closing strip, or as a grid of cards.
section: Data display
order: 1
group: Tables
traits: [server data]
keywords: [table, grid, sorting, filtering, pagination, datagrid]
---

<script>
  import { Anatomy, ApiTable, Preview } from '#modules/docs/components/index.js'
  import examples from './examples?examples'
</script>

<Preview example={examples.basic} />

In an app, sorting and filtering are the server's. The table reports what the reader asked for through `filters` and `onFiltersChange`, and the caller refetches; `hasNextPage` and `fetchNextPage` give it a load-more. These examples filter their few rows in the browser.

## Anatomy

<Anatomy example={examples.anatomy} parts={[
  { slot: 'data-table', label: 'Card', part: 'DataTable', placement: 'top' },
  { slot: 'data-table-toolbar', label: 'Toolbar', part: 'DataTableToolbar', placement: 'left' },
  { slot: 'table-head', label: 'Column header', part: 'DataTableColumnHeader', placement: 'left' },
  { slot: 'table-header', label: 'Header row', placement: 'right' },
  { slot: 'table-cell', label: 'Cell', placement: 'left' },
  { slot: 'data-table-row-actions', label: 'Row actions', part: 'DataTableRowActions', placement: 'right' },
  { slot: 'data-table-strip', label: 'Closing strip', placement: 'bottom' },
]} />

## Examples

### With a toolbar

`DataTableToolbar` holds the search and a faceted filter per column; each filter's column needs a `filterFn`. `DataTableRowActions` is the ⋯ menu at the end of a row: name the row in its `label`, and put the destructive action last.

<Preview example={examples.toolbar} />

### Row selection

`enableRowSelection` adds a leading checkbox column, and `bind:rowSelection` holds what is ticked. Always give `getRowId`, or the selection is keyed by index and lost on a sort.

<Preview example={examples.selection} />

### Loading and empty

Loading draws skeleton rows and no closing strip. An empty table shows its `emptyState` across every column.

<Preview example={examples.states} />

### Grid view

`viewMode="grid"` draws each row through the `card` snippet; `DataTableViewToggle` switches the two.

<Preview example={examples.grid} />

## Building columns

`dataTableColumns<Row>()` types the columns. Headers that sort use `DataTableColumnHeader`; a cell that is more than text renders a snippet.

```svelte
<script lang="ts">
  import { DataTableColumnHeader, dataTableColumns } from '@jovertical/mise-design-system'
  import { renderComponent, renderSnippet } from '@tanstack/svelte-table'

  const column = dataTableColumns<Order>()

  const columns = column.columns([
    column.accessor('number', {
      header: ({ column }) => renderComponent(DataTableColumnHeader, { column, title: 'Order' }),
    }),
    column.accessor('status', {
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
    }),
  ])
</script>
```

`@tanstack/svelte-table` comes with mise, but a strict package manager lets an app import only what it lists: `pnpm add @tanstack/svelte-table`.

## When to use

`DataTable` is a listing: rows the reader sorts, searches and acts on. For a few rows with none of that, use `Table`.

## API reference

<ApiTable component="DataTable" />
