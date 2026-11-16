<!-- A listing: the title, what the page is for, and the one primary action. -->
<script lang="ts">
  import { Button, PageHeader } from '@jovertical/mise-design-system'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'
</script>

{#snippet newLocation()}
  <Button><IconPlus class="size-4" />New location</Button>
{/snippet}

<div class="w-full">
  <PageHeader
    title="Locations"
    description="Every location trading on this account."
    actions={newLocation}
  />
</div>
