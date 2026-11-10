<!--
  Origin: the React package 2.23.0 `data-table.tsx`
  Diverged: TanStack Table 9's Svelte adapter for `@tanstack/react-table` 8
    (round 4b, R4b-1): `createTable` with `dataTableFeatures` for
    `useReactTable`, `FlexRender` for `flexRender`, `renderComponent` for a
    JSX header or cell. The filters are `bind:filters`, one bindable value the
    caller may mirror into its URL, with `onFiltersChange` fired on the
    reader's own changes; React kept them in state and suppressed the echo of
    its own URL writes, which a two-way binding has no need for. Row selection
    is `bind:rowSelection`. The table itself is built in
    `data-table-state.svelte.ts`; the closing strip and the grid view are the
    internal parts `data-table-table-view.svelte` (with
    `data-table-strip.svelte`) and `data-table-grid.svelte`.
    `toolbar`, `emptyState`, `footer`, `card` (React's
    `cardRenderer`) and `cardSkeleton` are snippets, and `title` and
    `description` take a string or a snippet. `tourTarget`, which hooked
    the React package's product tour, is dropped (R4b-6). Takes `class`, as every
    component does.
-->
<script lang="ts" module>
  import type {
    ColumnVisibilityState,
    RowData,
    RowSelectionState,
    Table as TanStackTable,
  } from '@tanstack/svelte-table'
  import type { Snippet } from 'svelte'

  import type {
    DataTableColumn,
    DataTableFeatures,
    DataTableFilterState,
    DataTableViewMode,
  } from './features.js'

  export type DataTableInstance<TData extends RowData> = TanStackTable<DataTableFeatures, TData>

  /**
   * A listing: a card holding an optional title, a toolbar, the table and a
   * closing strip, or a grid of cards in `grid` view. Sorting and filtering
   * are the server's; the table reports what the reader asked for and the
   * caller refetches.
   */
  export type DataTableProps<TData extends RowData> = {
    columns: DataTableColumn<TData>[]
    data: TData[]
    isLoading?: boolean
    /** A next page is being fetched; the load-more control spins. */
    isFetchingNextPage?: boolean
    /** There are more rows to load; the closing strip offers them. */
    hasNextPage?: boolean
    fetchNextPage?: () => void
    /** The first sort, a column id, prefixed with `-` for descending. */
    defaultSort?: string
    /**
     * The search, the column filters and the sort. Bind it to mirror it into a
     * URL; a new value from outside is applied.
     */
    filters?: DataTableFilterState
    /** Called when the reader changes the search, a filter or the sort. */
    onFiltersChange?: (filters: DataTableFilterState) => void
    /** A heading inside the table's card, above the toolbar: what the rows are. Table view only. */
    title?: string | Snippet
    /** One muted line under `title`. */
    description?: string | Snippet
    /** The row above the table. Receives the table and the current filters. */
    toolbar?: Snippet<[DataTableInstance<TData>, DataTableFilterState]>
    /** What an empty table shows. */
    emptyState?: Snippet
    /**
     * Replaces the closing strip's contents, for a summary card that wants one
     * "View all" link rather than a count and a load-more.
     */
    footer?: Snippet
    /** Page padding around the table, on by default. */
    withPadding?: boolean
    /**
     * The row's id. Without it, rows are keyed by index, which breaks
     * selection and expansion: supply it whenever either is on.
     */
    getRowId?: (row: TData) => string
    viewMode?: DataTableViewMode
    /** One item in `grid` view. */
    card?: Snippet<[TData]>
    /** One placeholder card while `grid` view loads. */
    cardSkeleton?: Snippet
    /** Classes for the grid, replacing the responsive one-to-three columns. */
    gridClass?: string
    getItemKey?: (item: TData) => string | number
    /** Classes for one row. */
    getRowClass?: (item: TData) => string | undefined
    initialColumnVisibility?: ColumnVisibilityState
    /** Makes rows a click target, with a pointer and a hover. */
    onRowClick?: (item: TData) => void
    /**
     * A row's children, or undefined when it has none. Supplying it turns
     * expansion on; the cells render the disclosure from `row.getCanExpand()`,
     * `row.getIsExpanded()` and `row.depth`.
     */
    getSubRows?: (row: TData) => TData[] | undefined
    /** A leading checkbox column, for bulk actions. */
    enableRowSelection?: boolean
    rowSelection?: RowSelectionState
    /** Only these rows get an enabled checkbox: keep a user from selecting themselves. */
    isRowSelectable?: (item: TData) => boolean
    class?: string
  }

  /** The sort a `defaultSort` string asks for. */
  export function sortingFromDefault(defaultSort: string | undefined) {
    if (!defaultSort) return []

    const desc = defaultSort.startsWith('-')

    return [{ id: desc ? defaultSort.slice(1) : defaultSort, desc }]
  }
</script>

<script lang="ts" generics="TData extends RowData">
  import { cn } from '../../../utils/cn.js'
  import DataTableGrid from './data-table-grid.svelte'
  import { createDataTable } from './data-table-state.svelte.js'
  import DataTableTableView from './data-table-table-view.svelte'

  let {
    columns,
    data,
    isLoading = false,
    isFetchingNextPage = false,
    hasNextPage = false,
    fetchNextPage,
    defaultSort,
    filters = $bindable({
      globalFilter: '',
      columnFilters: [],
      sorting: sortingFromDefault(defaultSort),
    }),
    onFiltersChange,
    title,
    description,
    toolbar,
    emptyState,
    footer,
    withPadding = true,
    getRowId,
    viewMode = 'table',
    card,
    cardSkeleton,
    gridClass,
    getItemKey,
    getRowClass,
    initialColumnVisibility,
    onRowClick,
    getSubRows,
    enableRowSelection = false,
    rowSelection = $bindable({}),
    isRowSelectable,
    class: className,
  }: DataTableProps<TData> = $props()

  const { table, selectable } = createDataTable<TData>({
    get data() {
      return data
    },
    get columns() {
      return columns
    },
    get filters() {
      return filters
    },
    setFilters: (next) => {
      filters = next

      onFiltersChange?.(next)
    },
    get rowSelection() {
      return rowSelection
    },
    setRowSelection: (next) => {
      rowSelection = next
    },
    get initialColumnVisibility() {
      return initialColumnVisibility
    },
    get getRowId() {
      return getRowId
    },
    get getSubRows() {
      return getSubRows
    },
    get enableRowSelection() {
      return enableRowSelection
    },
    get isRowSelectable() {
      return isRowSelectable
    },
  })

  /**
   * Top-level rows only: with expansion on, the row model holds every open
   * child too, and "Showing 3 rows" should not climb as the reader opens them.
   */
  const rowCount = $derived(table.getRowModel().rows.filter((row) => row.depth === 0).length)
  const selectedCount = $derived(table.getSelectedRowModel().rows.length)
</script>

<div
  data-slot="data-table"
  data-view={viewMode}
  class={cn('flex w-full min-w-0 flex-col gap-4', withPadding && 'px-4 lg:px-6', className)}
>
  {#if viewMode === 'grid'}
    {@render toolbar?.(table, filters)}
    <DataTableGrid
      {data}
      {card}
      {cardSkeleton}
      {gridClass}
      {getItemKey}
      {emptyState}
      {isLoading}
      {hasNextPage}
      {isFetchingNextPage}
      {fetchNextPage}
    />
  {:else}
    <DataTableTableView
      {table}
      {filters}
      {title}
      {description}
      {toolbar}
      {emptyState}
      {isLoading}
      {getRowClass}
      {onRowClick}
      {selectable}
      strip={{
        footer,
        rowCount,
        selectedCount,
        enableRowSelection,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
      }}
    />
  {/if}
</div>
