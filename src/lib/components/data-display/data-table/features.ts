/**
 * Origin: the React package 2.23.0 `data-table.tsx` (the `useReactTable` options)
 * Diverged: TanStack Table 9 declares its features up front (round 4b, R4b-1);
 *   v8 took `getFilteredRowModel()` and the like as options. These are the
 *   features `DataTable` and its parts use, and nothing else is bundled.
 */
import {
  type ColumnDef,
  type ColumnFiltersState,
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  globalFilteringFeature,
  type RowData,
  rowExpandingFeature,
  rowSelectionFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
} from '@tanstack/svelte-table'

export const dataTableFeatures = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowExpandingFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  expandedRowModel: createExpandedRowModel(),
})

export type DataTableFeatures = typeof dataTableFeatures

/** A column for `DataTable`. Build them with `dataTableColumns<Row>()`. */
// biome-ignore lint/suspicious/noExplicitAny: a column's value type varies per column, as in TanStack's own ColumnDef.
export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData, any>

/**
 * A column helper typed to `DataTable`'s features:
 * `const column = dataTableColumns<Device>(); column.accessor('serial', { header: 'Serial' })`.
 */
export function dataTableColumns<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>()
}

export type DataTableViewMode = 'table' | 'grid'

/**
 * What the reader has asked the table for: the search, the column filters and
 * the sort. Sorting and filtering are the server's: the table reports them and
 * the caller refetches.
 */
export type DataTableFilterState = {
  globalFilter: string
  columnFilters: ColumnFiltersState
  sorting: SortingState
}
