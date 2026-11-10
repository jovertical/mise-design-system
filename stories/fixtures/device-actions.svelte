<!-- Story scaffolding, not a package export: a device row's ⋯ menu. -->
<script lang="ts">
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconPlayerPause from '@tabler/icons-svelte-runes/icons/player-pause'
  import IconTrash from '@tabler/icons-svelte-runes/icons/trash'

  import DropdownMenuItem from '../../src/lib/components/actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuSeparator from '../../src/lib/components/actions/dropdown-menu/dropdown-menu-separator.svelte'
  import DataTableRowActions from '../../src/lib/components/data-display/data-table/data-table-row-actions.svelte'

  let { serial }: { serial: string } = $props()
</script>

<DataTableRowActions label="Actions for {serial}">
  <DropdownMenuItem><IconPencil />Edit</DropdownMenuItem>
  <DropdownMenuItem><IconPlayerPause />Suspend</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive"><IconTrash />Unpair</DropdownMenuItem>
</DataTableRowActions>
