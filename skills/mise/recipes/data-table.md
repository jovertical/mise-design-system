# Recipe: a data table

Today's orders, with search, a status filter, sortable columns, row selection for a bulk action,
and a menu of actions on each row. The code is [data-table.svelte](data-table.svelte), which
type-checks against the current mise.

## What it is made of

- `DataTable` ([data display](../components/data-display.md)): the card, the table, the empty
  state and the closing strip with the row count.
- `dataTableColumns<Order>()` to build typed columns, `DataTableColumnHeader` for a sortable
  header, and `renderSnippet` or `renderComponent` from `@tanstack/svelte-table` for cells.
- `DataTableToolbar` above the rows: the search, the faceted status filter, the column toggle,
  and the app's bulk actions in `actions`.
- `DataTableRowActions` with `DropdownMenuItem`s ([actions](../components/actions.md)): the ⋯
  menu at the end of each row.
- `Badge` with a `tone` per status, and `Empty` for "no orders match".

## Decisions worth copying

- **`getRowId` whenever rows can be selected.** Without it rows are keyed by index, and a
  selection survives neither a sort nor a new page.
- **A faceted filter needs a `filterFn`.** The status filter sets a list of values; the column's
  `filterFn` keeps a row whose status is in it.
- **Status is data, tone is presentation.** A `STATUS_TONE` map turns each status into a `tone`,
  in one place.
- **Name the row in its actions label** ("Actions for order #1042"), so a screen reader moving
  down the column hears which row the menu belongs to.
- **The destructive action is last** and uses `variant="destructive"`; it is disabled, not
  hidden, where it does not apply.
- **Server data:** for a long list, keep the rows on the server. Pass `filters` and
  `onFiltersChange` to send the search, filters and sort with the request, and `hasNextPage`
  with `fetchNextPage` for load-more.

## Dependencies

The columns import `renderSnippet` and `renderComponent` from `@tanstack/svelte-table`. mise
depends on it, but a strict package manager only lets the app import what it declares:
`pnpm add @tanstack/svelte-table`.
