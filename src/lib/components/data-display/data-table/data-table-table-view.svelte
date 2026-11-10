<!--
  Origin: the React package 2.23.0 `data-table.tsx` (the table view)
  Diverged: `table` view, the card holding the heading, the toolbar, the table
    and the closing strip, as its own part so DataTable keeps under the size
    the clean-code guide allows. Not exported.
-->
<script lang="ts" module>
  import type { RowData } from '@tanstack/svelte-table'
  import type { Snippet } from 'svelte'

  import type { DataTableInstance } from './data-table.svelte'
  import type { DataTableStripProps } from './data-table-strip.svelte'
  import type { DataTableFilterState } from './features.js'

  const SKELETON_WIDTHS = ['w-16', 'w-24', 'w-20', 'w-32', 'w-28']

  export type DataTableTableViewProps<TData extends RowData> = {
    table: DataTableInstance<TData>
    filters: DataTableFilterState
    title?: string | Snippet
    description?: string | Snippet
    toolbar?: Snippet<[DataTableInstance<TData>, DataTableFilterState]>
    emptyState?: Snippet
    isLoading: boolean
    getRowClass?: (item: TData) => string | undefined
    onRowClick?: (item: TData) => void
    selectable: (item: TData) => boolean
    strip: DataTableStripProps
  }
</script>

<script lang="ts" generics="TData extends RowData">
  import { FlexRender } from '@tanstack/svelte-table'

  import { cn } from '../../../utils/cn.js'
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'
  import Table from '../table/table.svelte'
  import TableBody from '../table/table-body.svelte'
  import TableCell from '../table/table-cell.svelte'
  import TableHead from '../table/table-head.svelte'
  import TableHeader from '../table/table-header.svelte'
  import TableRow from '../table/table-row.svelte'
  import DataTableStrip from './data-table-strip.svelte'

  let {
    table,
    filters,
    title,
    description,
    toolbar,
    emptyState,
    isLoading,
    getRowClass,
    onRowClick,
    selectable,
    strip,
  }: DataTableTableViewProps<TData> = $props()
</script>

{#snippet text(node: string | Snippet)}
  {#if typeof node === 'function'}
    {@render node()}
  {:else}
    {node}
  {/if}
{/snippet}

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
  <DataTableStrip {...strip} />
</div>
