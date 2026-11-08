<script lang="ts">
  import { DataTableRowActions, DropdownMenuItem } from '../../src/lib/index.js'

  let { onRowClick, disabled = false }: { onRowClick: () => void; disabled?: boolean } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<!-- biome-ignore lint/a11y/noStaticElementInteractions: not a control; it stops the row's click under the button -->
<!-- biome-ignore lint/a11y/useKeyWithClickEvents: the button inside is the control, with its own keyboard handling -->
<div data-testid="row" onclick={onRowClick}>
  <DataTableRowActions label="Actions for Riverside" {disabled}>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  </DataTableRowActions>
</div>
