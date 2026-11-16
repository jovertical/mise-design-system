<!--
  `solid` for a grid of toggles read at a glance, as a permission matrix draws
  one role's actions on one resource. The disabled row is granted and not the
  viewer's to change. `iconOnly` makes each a circle, and needs its aria-label.
-->
<script lang="ts">
  import { Toggle } from '@jovertical/mise-design-system'
  import IconEye from '@tabler/icons-svelte-runes/icons/eye'
  import IconPencil from '@tabler/icons-svelte-runes/icons/pencil'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
  import IconTrash from '@tabler/icons-svelte-runes/icons/trash'

  const ACTIONS = [
    { id: 'view', label: 'view', icon: IconEye },
    { id: 'edit', label: 'edit', icon: IconPencil },
    { id: 'create', label: 'create', icon: IconPlus },
    { id: 'delete', label: 'delete', icon: IconTrash },
  ]

  let granted: Record<string, boolean> = $state({
    view: true,
    edit: true,
    create: false,
    delete: false,
  })
</script>

<div class="flex items-center gap-1.5">
  {#each ACTIONS as action (action.id)}
    <Toggle
      iconOnly
      size="sm"
      variant="solid"
      bind:pressed={granted[action.id]}
      aria-label="{granted[action.id] ? 'Revoke' : 'Grant'} {action.label} stock"
    >
      <action.icon />
    </Toggle>
  {/each}
</div>
