<!--
  Origin: the React package 2.23.0 `data-table.tsx`
  Diverged: TanStack Table 9's Svelte adapter for `@tanstack/react-table` 8
    (round 4b, R4b-1): `createTable` with `dataTableFeatures` for
    `useReactTable`, `FlexRender` for `flexRender`, `renderComponent` for a
    JSX header or cell. The filters are `bind:filters`, one bindable value the
    caller may mirror into its URL, with `onFiltersChange` fired on the
    reader's own changes; React kept them in state and suppressed the echo of
    its own URL writes, which a two-way binding has no need for. Row selection
    is `bind:rowSelection`. `autoResetExpanded` is off: v9 resets expansion on
    every row-model rebuild, which opening a row itself triggers. `toolbar`, `emptyState`, `footer`, `card` (React's
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

  const SKELETON_WIDTHS = ['w-16', 'w-24', 'w-20', 'w-32', 'w-28']

  /** The sort a `defaultSort` string asks for. */
  export function sortingFromDefault(defaultSort: string | undefined) {
    if (!defaultSort) return []

    const desc = defaultSort.startsWith('-')

    return [{ id: desc ? defaultSort.slice(1) : defaultSort, desc }]
  }
</script>

<script lang="ts" generics="TData extends RowData">
  import {
    createTable,
    type ExpandedState,
    FlexRender,
    type Row,
    renderComponent,
    type Updater,
  } from '@tanstack/svelte-table'

  import { cn } from '../../../utils/cn.js'
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'
  import Spinner from '../../feedback/spinner/spinner.svelte'
  import Checkbox from '../../forms/checkbox/checkbox.svelte'
  import Table from '../table/table.svelte'
  import TableBody from '../table/table-body.svelte'
  import TableCell from '../table/table-cell.svelte'
  import TableHead from '../table/table-head.svelte'
  import TableHeader from '../table/table-header.svelte'
  import TableRow from '../table/table-row.svelte'
  import { dataTableColumns, dataTableFeatures } from './features.js'

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

  // The visibility a table opens with; the reader's toggles live here after that.
  // svelte-ignore state_referenced_locally
  let columnVisibility = $state<ColumnVisibilityState>(initialColumnVisibility ?? {})
  /** Which rows are open. A reading aid, not a query, so it stays here. */
  let expanded = $state<ExpandedState>({})

  const resolve = <T>(updater: Updater<T>, current: T): T =>
    typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater

  function setFilters(next: DataTableFilterState) {
    filters = next

    onFiltersChange?.(next)
  }

  const selectable = (item: TData) => !isRowSelectable || isRowSelectable(item)

  const allColumns = $derived.by((): typeof columns => {
    if (!enableRowSelection) return columns

    const column = dataTableColumns<TData>()

    const select = column.display({
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

    return [select, ...columns]
  })

  const table = createTable({
    features: dataTableFeatures,
    get data() {
      return data
    },
    get columns() {
      return allColumns
    },
    state: {
      get sorting() {
        return filters.sorting
      },
      get globalFilter() {
        return filters.globalFilter
      },
      get columnFilters() {
        return filters.columnFilters
      },
      get columnVisibility() {
        return columnVisibility
      },
      get rowSelection() {
        return rowSelection
      },
      get expanded() {
        return expanded
      },
    },
    get getRowId() {
      return getRowId ? (row: TData) => getRowId(row) : undefined
    },
    get getSubRows() {
      return getSubRows
    },
    enableHiding: true,
    get enableMultiRowSelection() {
      return enableRowSelection
    },
    get enableRowSelection() {
      return enableRowSelection
        ? (row: Row<DataTableFeatures, TData>) => selectable(row.original)
        : false
    },
    manualSorting: true,
    manualFiltering: true,
    // v9 resets expansion whenever it rebuilds the row model, and opening a row
    // rebuilds it, so the row would close again at once. Expansion is the
    // table's own reading aid; nothing outside should reset it.
    autoResetExpanded: false,
    onSortingChange: (updater) =>
      setFilters({ ...filters, sorting: resolve(updater, filters.sorting) }),
    onGlobalFilterChange: (updater) =>
      setFilters({ ...filters, globalFilter: resolve(updater, filters.globalFilter) }),
    onColumnFiltersChange: (updater) =>
      setFilters({ ...filters, columnFilters: resolve(updater, filters.columnFilters) }),
    onColumnVisibilityChange: (updater) => {
      columnVisibility = resolve(updater, columnVisibility)
    },
    onRowSelectionChange: (updater) => {
      rowSelection = resolve(updater, rowSelection)
    },
    onExpandedChange: (updater) => {
      expanded = resolve(updater, expanded)
    },
  })

  /**
   * Top-level rows only: with expansion on, the row model holds every open
   * child too, and "Showing 3 rows" should not climb as the reader opens them.
   */
  const rowCount = $derived(table.getRowModel().rows.filter((row) => row.depth === 0).length)
  const selectedCount = $derived(table.getSelectedRowModel().rows.length)
</script>

{#snippet text(node: string | Snippet)}
  {#if typeof node === 'function'}
    {@render node()}
  {:else}
    {node}
  {/if}
{/snippet}

{#snippet closingStrip()}
  {#if !isLoading && rowCount > 0}
    {#if footer}
      <div
        class="text-muted-foreground flex items-center justify-center border-t px-4 py-3 text-sm"
      >
        {@render footer()}
      </div>
    {:else}
      <div
        data-slot="data-table-strip"
        class="text-muted-foreground grid grid-cols-3 items-center gap-4 border-t px-4 py-3 text-sm"
      >
        <span class="tabular-nums">
          {enableRowSelection
            ? `${selectedCount} of ${rowCount} row(s) selected`
            : `Showing ${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`}
        </span>
        <div class="flex justify-center">
          {#if hasNextPage}
            <button
              type="button"
              class="text-foreground cursor-pointer font-medium hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              onclick={fetchNextPage}
              disabled={isFetchingNextPage}
            >
              {#if isFetchingNextPage}
                <Spinner />
              {:else}
                Load more
              {/if}
            </button>
          {/if}
        </div>
        <!-- Balances the count so the button sits centred. -->
        <span aria-hidden="true"></span>
      </div>
    {/if}
  {/if}
{/snippet}

{#snippet tableView()}
  <div class="bg-card overflow-hidden rounded-[min(var(--radius-4xl),24px)] border">
    {#if title || description}
      <div class="flex flex-col gap-1 px-4 pt-4 pb-1">
        {#if title}
          <div class="font-heading text-base font-medium">{@render text(title)}</div>
        {/if}
        {#if description}
          <div class="text-muted-foreground text-sm">{@render text(description)}</div>
        {/if}
      </div>
    {/if}
    {#if toolbar}
      <div class="border-b px-4 py-3">{@render toolbar(table, filters)}</div>
    {/if}
    <div class="overflow-x-auto">
      <Table>
        <TableHeader>
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <TableRow>
              {#each headerGroup.headers as header (header.id)}
                <TableHead colspan={header.colSpan}>
                  {#if !header.isPlaceholder}
                    <FlexRender {header} />
                  {/if}
                </TableHead>
              {/each}
            </TableRow>
          {/each}
        </TableHeader>
        <TableBody>
          {#if isLoading}
            {#each Array.from({ length: 4 }, (_, index) => index) as rowIndex (rowIndex)}
              <TableRow>
                {#each table.getAllColumns() as column, columnIndex (column.id)}
                  <TableCell>
                    <Skeleton
                      class={cn('h-4', SKELETON_WIDTHS[columnIndex % SKELETON_WIDTHS.length])}
                    />
                  </TableCell>
                {/each}
              </TableRow>
            {/each}
          {:else if table.getRowModel().rows.length}
            {#each table.getRowModel().rows as row (row.id)}
              <TableRow
                data-state={row.getIsSelected() ? 'selected' : undefined}
                data-depth={row.depth}
                class={cn(
                  getRowClass?.(row.original),
                  onRowClick && 'hover:bg-muted/50 cursor-pointer',
                )}
                onclick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {#each row.getVisibleCells() as cell (cell.id)}
                  <!-- The selection cell, and any cell of an unselectable row, keeps its click. -->
                  <TableCell
                    onclick={cell.column.id === '__select__' ||
                    !(selectable(row.original) && onRowClick)
                      ? (event: MouseEvent) => event.stopPropagation()
                      : undefined}
                  >
                    <FlexRender {cell} />
                  </TableCell>
                {/each}
              </TableRow>
            {/each}
          {:else}
            <TableRow>
              <TableCell colspan={table.getAllColumns().length}>{@render emptyState?.()}</TableCell>
            </TableRow>
          {/if}
        </TableBody>
      </Table>
    </div>
    {@render closingStrip()}
  </div>
{/snippet}

{#snippet gridView()}
  {@const gridClasses = cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', gridClass)}
  {#if card}
    {#if isLoading}
      {#if cardSkeleton}
        <div class={gridClasses}>
          {#each Array.from({ length: 8 }, (_, index) => index) as index (index)}
            {@render cardSkeleton()}
          {/each}
        </div>
      {:else}
        <div class="flex h-24 items-center justify-center"><Spinner class="size-6" /></div>
      {/if}
    {:else if data.length === 0}
      {@render emptyState?.()}
    {:else}
      <div class={gridClasses}>
        {#each data as item, index (getItemKey?.(item) ?? index)}
          {@render card(item)}
        {/each}
      </div>
    {/if}
  {/if}
{/snippet}

<div
  data-slot="data-table"
  data-view={viewMode}
  class={cn('flex w-full min-w-0 flex-col gap-4', withPadding && 'px-4 lg:px-6', className)}
>
  {#if viewMode === 'grid'}
    {@render toolbar?.(table, filters)}
    {@render gridView()}
    {#if hasNextPage}
      <div class="mt-4 flex justify-center">
        <button
          type="button"
          class="text-muted-foreground cursor-pointer hover:underline"
          onclick={fetchNextPage}
          disabled={isFetchingNextPage}
        >
          {#if isFetchingNextPage}
            <Spinner />
          {:else}
            Load more
          {/if}
        </button>
      </div>
    {/if}
  {:else}
    {@render tableView()}
  {/if}
</div>
