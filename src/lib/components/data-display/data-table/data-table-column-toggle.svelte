<!--
  Origin: the React package 2.23.0 `data-table-column-toggle.tsx`
  Diverged: the table is TanStack Table 9's (R4b-1).
-->
<script lang="ts" module>
  import type { RowData } from '@tanstack/svelte-table'

  import type { DataTableInstance } from './data-table.svelte'

  /**
   * The columns a reader can hide, as checkboxes in a menu. Icon-only: a label
   * beside the glyph would wrap a toolbar that already holds several filters.
   */
  export type DataTableColumnToggleProps<TData extends RowData> = {
    table: DataTableInstance<TData>
  }
</script>

<script lang="ts" generics="TData extends RowData">
  import IconLayoutColumns from '@tabler/icons-svelte-runes/icons/layout-columns'

  import Button from '../../actions/button/button.svelte'
  import DropdownMenu from '../../actions/dropdown-menu/dropdown-menu.svelte'
  import DropdownMenuCheckboxItem from '../../actions/dropdown-menu/dropdown-menu-checkbox-item.svelte'
  import DropdownMenuContent from '../../actions/dropdown-menu/dropdown-menu-content.svelte'
  import DropdownMenuLabel from '../../actions/dropdown-menu/dropdown-menu-label.svelte'
  import DropdownMenuSeparator from '../../actions/dropdown-menu/dropdown-menu-separator.svelte'
  import DropdownMenuTrigger from '../../actions/dropdown-menu/dropdown-menu-trigger.svelte'

  let { table }: DataTableColumnToggleProps<TData> = $props()

  const columns = $derived(
    table
      .getAllColumns()
      .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
  )
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button
        variant="ghost"
        tone="neutral"
        iconOnly
        aria-label="Toggle columns"
        class="border-border bg-card size-8 rounded-full border"
        {...props}
      >
        <IconLayoutColumns class="size-4" />
      </Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" class="min-w-40">
    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
    <DropdownMenuSeparator />
    {#each columns as column (column.id)}
      <DropdownMenuCheckboxItem
        class="capitalize"
        checked={column.getIsVisible()}
        onCheckedChange={(value) => column.toggleVisibility(!!value)}
      >
        {column.id.replace(/_/g, ' ')}
      </DropdownMenuCheckboxItem>
    {/each}
  </DropdownMenuContent>
</DropdownMenu>
