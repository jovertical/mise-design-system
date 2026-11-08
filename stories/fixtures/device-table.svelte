<!--
  Story scaffolding, not a package export: a real TanStack table over the
  devices, for the parts driven by one (column header, column toggle, faceted
  filter). A faked instance would show a sort arrow that never moves.
-->
<script lang="ts">
  import {
    type ColumnFiltersState,
    type ColumnVisibilityState,
    createTable,
    type SortingState,
  } from '@tanstack/svelte-table'
  import type { Snippet } from 'svelte'

  import type { DataTableInstance } from '../../src/lib/components/data-display/data-table/data-table.svelte'
  import { dataTableFeatures } from '../../src/lib/components/data-display/data-table/features.js'
  import { DEVICES, type Device, deviceColumns } from './devices.js'

  let { children }: { children: Snippet<[DataTableInstance<Device>]> } = $props()

  let sorting = $state<SortingState>([])
  let columnFilters = $state<ColumnFiltersState>([])
  let columnVisibility = $state<ColumnVisibilityState>({})

  const resolve = <T>(updater: T | ((old: T) => T), current: T): T =>
    typeof updater === 'function' ? (updater as (old: T) => T)(current) : updater

  const table = createTable({
    features: dataTableFeatures,
    data: DEVICES,
    columns: deviceColumns,
    state: {
      get sorting() {
        return sorting
      },
      get columnFilters() {
        return columnFilters
      },
      get columnVisibility() {
        return columnVisibility
      },
    },
    onSortingChange: (updater) => {
      sorting = resolve(updater, sorting)
    },
    onColumnFiltersChange: (updater) => {
      columnFilters = resolve(updater, columnFilters)
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility = resolve(updater, columnVisibility)
    },
  })
</script>

{@render children(table)}
