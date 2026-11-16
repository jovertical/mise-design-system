<!-- For the anatomy. -->
<script lang="ts">
  import { Button, EmptyState } from '@jovertical/mise-design-system'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
</script>

{#snippet store()}
  <IconBuildingStore />
{/snippet}

{#snippet actions()}
  <Button variant="outline">Import locations</Button>
  <Button>Add location</Button>
{/snippet}

<EmptyState
  icon={store}
  title="No locations yet"
  description="Add the first location to start pairing registers to it."
  {actions}
/>
