/**
 * Origin: the React package 2.23.0 `data-table.tsx` (its `useReactTable` call)
 * Diverged: the TanStack Table instance DataTable draws, with its selection
 *   column, built here so DataTable keeps under the size the clean-code guide
 *   allows. Column visibility and expansion are the table's own state and live
 *   here; the filters and the row selection belong to the caller and are read
 *   and written through `source`. `autoResetExpanded` is off: v9 resets
 *   expansion on every row-model rebuild, which opening a row itself triggers.
 */
import {
  type ColumnVisibilityState,
  createTable,
  type ExpandedState,
  type Row,
  type RowData,
  type RowSelectionState,
  renderComponent,
  type Updater,
} from '@tanstack/svelte-table'

import Checkbox from '../../forms/checkbox/checkbox.svelte'
import {
  type DataTableColumn,
  type DataTableFeatures,
  type DataTableFilterState,
  dataTableColumns,
  dataTableFeatures,
} from './features.js'

/** What the table reads from DataTable's props, and how it writes back. */
export type DataTableSource<TData extends RowData> = {
  readonly data: TData[]
  readonly columns: DataTableColumn<TData>[]
  readonly filters: DataTableFilterState
  setFilters: (next: DataTableFilterState) => void
  readonly rowSelection: RowSelectionState
  setRowSelection: (next: RowSelectionState) => void
  readonly initialColumnVisibility?: ColumnVisibilityState
  readonly getRowId?: (row: TData) => string
  readonly getSubRows?: (row: TData) => TData[] | undefined
  readonly enableRowSelection: boolean
  readonly isRowSelectable?: (item: TData) => boolean
}

/** The table, and whether a row may be selected. Call it while a component initialises. */
export function createDataTable<TData extends RowData>(source: DataTableSource<TData>) {
  const local = localState(source)
  const selectable = (item: TData) => !source.isRowSelectable || source.isRowSelectable(item)

  const allColumns = $derived(
    source.enableRowSelection
      ? [selectionColumn<TData>(selectable), ...source.columns]
      : source.columns,
  )

  return {
    selectable,
    table: createTable({
      features: dataTableFeatures,
      get data() {
        return source.data
      },
      get columns() {
        return allColumns
      },
      state: tableState(source, local),
      get getRowId() {
        return source.getRowId ? (row: TData) => source.getRowId?.(row) ?? '' : undefined
      },
      get getSubRows() {
        return source.getSubRows
      },
      get enableMultiRowSelection() {
        return source.enableRowSelection
      },
      get enableRowSelection() {
        return source.enableRowSelection
          ? (row: Row<DataTableFeatures, TData>) => selectable(row.original)
          : false
      },
      ...FIXED_OPTIONS,
      ...changeHandlers(source, local),
    }),
  }
}

type LocalState = { columnVisibility: ColumnVisibilityState; expanded: ExpandedState }

/**
 * The table's own state: the visibility it opens with, then the reader's
 * toggles, and which rows are open, a reading aid rather than a query.
 */
function localState<TData extends RowData>(source: DataTableSource<TData>): LocalState {
  const local: LocalState = $state({
    columnVisibility: source.initialColumnVisibility ?? {},
    expanded: {},
  })

  return local
}

const FIXED_OPTIONS = {
  enableHiding: true,
  manualSorting: true,
  manualFiltering: true,
  // v9 resets expansion whenever it rebuilds the row model, and opening a row
  // rebuilds it, so the row would close again at once. Expansion is the
  // table's own reading aid; nothing outside should reset it.
  autoResetExpanded: false,
} as const

/** Each change the reader makes, written to the caller's state or the table's own. */
function changeHandlers<TData extends RowData>(source: DataTableSource<TData>, local: LocalState) {
  const filter = (next: Partial<DataTableFilterState>) =>
    source.setFilters({ ...source.filters, ...next })

  return {
    onSortingChange: (updater: Updater<DataTableFilterState['sorting']>) =>
      filter({ sorting: resolve(updater, source.filters.sorting) }),
    onGlobalFilterChange: (updater: Updater<string>) =>
      filter({ globalFilter: resolve(updater, source.filters.globalFilter) }),
    onColumnFiltersChange: (updater: Updater<DataTableFilterState['columnFilters']>) =>
      filter({ columnFilters: resolve(updater, source.filters.columnFilters) }),
    onColumnVisibilityChange: (updater: Updater<ColumnVisibilityState>) => {
      local.columnVisibility = resolve(updater, local.columnVisibility)
    },
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      source.setRowSelection(resolve(updater, source.rowSelection))
    },
    onExpandedChange: (updater: Updater<ExpandedState>) => {
      local.expanded = resolve(updater, local.expanded)
    },
  }
}

/** The table's state, read live: the caller's filters and selection, and the table's own. */
function tableState<TData extends RowData>(source: DataTableSource<TData>, local: LocalState) {
  return {
    get sorting() {
      return source.filters.sorting
    },
    get globalFilter() {
      return source.filters.globalFilter
    },
    get columnFilters() {
      return source.filters.columnFilters
    },
    get columnVisibility() {
      return local.columnVisibility
    },
    get rowSelection() {
      return source.rowSelection
    },
    get expanded() {
      return local.expanded
    },
  }
}

const resolve = <T>(updater: Updater<T>, current: T): T =>
  typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater

/** The leading checkbox column `enableRowSelection` adds. */
function selectionColumn<TData extends RowData>(selectable: (item: TData) => boolean) {
  const column = dataTableColumns<TData>()

  return column.display({
    id: '__select__',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) =>
      renderComponent(Checkbox, {
        'aria-label': 'Select all',
        checked: table.getIsAllPageRowsSelected(),
        onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
      }),
    cell: ({ row }) =>
      renderComponent(Checkbox, {
        'aria-label': 'Select row',
        checked: row.getIsSelected(),
        disabled: !selectable(row.original),
        onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
      }),
  })
}
