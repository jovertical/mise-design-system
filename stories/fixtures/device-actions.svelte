<!-- Story scaffolding, not a package export: a device row's ⋯ menu. -->
<script lang="ts">
  import PauseIcon from '@lucide/svelte/icons/pause'
  import PencilIcon from '@lucide/svelte/icons/pencil'
  import TrashIcon from '@lucide/svelte/icons/trash'

  import DropdownMenuItem from '../../src/lib/components/actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuSeparator from '../../src/lib/components/actions/dropdown-menu/dropdown-menu-separator.svelte'
  import DataTableRowActions from '../../src/lib/components/data-display/data-table/data-table-row-actions.svelte'

  let { serial }: { serial: string } = $props()
</script>

<DataTableRowActions label="Actions for {serial}">
  <DropdownMenuItem><PencilIcon />Edit</DropdownMenuItem>
  <DropdownMenuItem><PauseIcon />Suspend</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive"><TrashIcon />Unpair</DropdownMenuItem>
</DataTableRowActions>
