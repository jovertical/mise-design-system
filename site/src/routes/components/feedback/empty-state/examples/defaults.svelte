<!--
  With no wording of its own the panel falls back to copy that is true
  anywhere: the tell that a screen has not been given its own yet. Then a
  title and a line saying where the things will come from.
-->
<script lang="ts">
  import { EmptyState } from '@jovertical/mise-design-system'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
  import IconDeviceTablet from '@tabler/icons-svelte-runes/icons/device-tablet'
</script>

{#snippet tablet()}
  <IconDeviceTablet />
{/snippet}

{#snippet store()}
  <IconBuildingStore />
{/snippet}

<div class="grid w-full gap-6 md:grid-cols-2">
  <EmptyState icon={tablet} />
  <EmptyState
    icon={store}
    title="No locations yet"
    description="Locations appear here once setup is finished."
  />
</div>
