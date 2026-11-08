<!--
  Origin: the React package 2.23.0 `data-table-toolbar.tsx`
  Diverged: no `filterState` prop: React needed a fresh object each render to
    get past the React Compiler's memo, and Svelte tracks the table's state
    directly. `bind:viewMode` for `viewMode` and `onViewModeChange`. `leading`
    and `actions` are snippets. The search field drops `font-mono`, which the
    package does not use. Lucide's search and funnel-x for Tabler's search and
    filter-x. The table is TanStack Table 9's (R4b-1).
-->
<script lang="ts" module>
  import type { RowData } from '@tanstack/svelte-table'
  import type { Snippet } from 'svelte'

  import type { DataTableInstance } from './data-table.svelte'
  import type { DataTableExportMenuProps } from './data-table-export-menu.svelte'
  import type { DataTableFacetedFilterOption } from './data-table-faceted-filter.svelte'
  import type { DataTableViewMode } from './features.js'

  export type DataTableToolbarFilter = {
    /** The column it narrows. A filter naming a column the table lacks is skipped. */
    columnId: string
    /** Names the filter in its search box. */
    title?: string
    /** The unselected label. Defaults to "All {title}". */
    allLabel?: string
    options: DataTableFacetedFilterOption[]
  }

  export type DataTableToolbarSearch = {
    placeholder?: string
    /** 300ms by default. Lower it only for a list small enough to filter locally. */
    debounceMs?: number
  }

  /**
   * The row above a table: what narrows it on the left, what acts on it on the
   * right. Written once because it was written twenty-three times, and nineteen
   * had drifted into putting export and the column toggle on the left, where
   * they read as another filter. Strings are props: a package cannot reach the
   * consumer's copy.
   */
  export type DataTableToolbarProps<TData extends RowData> = {
    table: DataTableInstance<TData>
    /** Omit for a table with nothing worth searching: a ledger, a feed. */
    search?: DataTableToolbarSearch
    filters?: DataTableToolbarFilter[]
    /** On the left, beside the filters: scopes such as a location or a date range. */
    leading?: Snippet
    /** On the right, ahead of clear: things you do, such as an import link or a bulk action. */
    actions?: Snippet
    /** Omit for a table with nothing to export. */
    exports?: DataTableExportMenuProps
    /** Bind it to show the table/grid toggle; the page owns the mode. */
    viewMode?: DataTableViewMode
    /** True by default. False for a table whose columns are all essential. */
    columnToggle?: boolean
    /** The clear button's accessible name. */
    clearLabel?: string
    class?: string
  }

  const DEFAULT_SEARCH_DEBOUNCE_MS = 300
</script>

<script lang="ts" generics="TData extends RowData">
  import FunnelXIcon from '@lucide/svelte/icons/funnel-x'
  import SearchIcon from '@lucide/svelte/icons/search'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Input from '../../forms/input/input.svelte'
  import DataTableColumnToggle from './data-table-column-toggle.svelte'
  import DataTableExportMenu from './data-table-export-menu.svelte'
  import DataTableFacetedFilter from './data-table-faceted-filter.svelte'
  import DataTableViewToggle from './data-table-view-toggle.svelte'

  let {
    table,
    search,
    filters = [],
    leading,
    actions,
    exports,
    viewMode = $bindable(),
    columnToggle = true,
    clearLabel = 'Clear filters',
    class: className,
  }: DataTableToolbarProps<TData> = $props()

  // svelte-ignore state_referenced_locally
  let searchValue = $state((table.store.get().globalFilter as string) ?? '')

  /** The search waits for the reader to pause before it filters. */
  $effect(() => {
    const value = searchValue
    const timer = setTimeout(
      () => table.setGlobalFilter(value),
      search?.debounceMs ?? DEFAULT_SEARCH_DEBOUNCE_MS,
    )
    return () => clearTimeout(timer)
  })

  /** Both halves count: a search with no column filter still has something to clear. */
  const isFiltered = $derived(
    table.store.get().columnFilters.length > 0 ||
      ((table.store.get().globalFilter as string) ?? '') !== '',
  )

  /**
   * A filter naming a column the table lacks is dropped rather than crashing:
   * pages leave columns out by permission, and the filter list is written once
   * for the table's fullest shape.
   */
  const present = $derived(
    filters.flatMap((filter) => {
      const column = table.getColumn(filter.columnId)
      return column ? [{ filter, column }] : []
    }),
  )

  function clear() {
    table.resetColumnFilters()
    searchValue = ''
    table.setGlobalFilter('')
  }
</script>

<div data-slot="data-table-toolbar" class={cn('flex flex-wrap items-center gap-2', className)}>
  {#if search}
    <div class="relative w-full sm:w-56 lg:w-64">
      <SearchIcon
        class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <Input
        placeholder={search.placeholder}
        aria-label={search.placeholder ?? 'Search'}
        bind:value={searchValue}
        class="bg-input/50 h-8 w-full rounded-2xl border-transparent pl-9"
      />
    </div>
  {/if}

  {#each present as { filter, column } (filter.columnId)}
    <DataTableFacetedFilter
      {column}
      title={filter.title}
      allLabel={filter.allLabel}
      options={filter.options}
    />
  {/each}

  {@render leading?.()}

  <!-- Past here is what you do to the rows, not which rows you see. -->
  <div class="ml-auto flex flex-wrap items-center gap-2">
    {@render actions?.()}
    {#if exports}
      <DataTableExportMenu {...exports} />
    {/if}
    {#if isFiltered}
      <Button
        variant="ghost"
        tone="neutral"
        iconOnly
        aria-label={clearLabel}
        onclick={clear}
        class="border-border bg-card size-8 rounded-full border"
      >
        <FunnelXIcon class="size-4" />
      </Button>
    {/if}
    {#if viewMode !== undefined}
      <DataTableViewToggle bind:value={viewMode} />
    {/if}
    <!-- Hidden in grid view: there are no columns on screen to toggle. -->
    {#if columnToggle && viewMode !== 'grid'}
      <DataTableColumnToggle {table} />
    {/if}
  </div>
</div>
