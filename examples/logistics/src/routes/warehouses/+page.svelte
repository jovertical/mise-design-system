<!-- Warehouses: one card per site, with its capacity overall and by zone. New site adds one. -->
<script lang="ts">
  import { Button, CardGrid, PageHeader, PageLayout } from '@jovertical/mise-design-system'
  import Plus from '@lucide/svelte/icons/plus'

  import WarehouseCard from '#lib/components/warehouse-card.svelte'
  import { store } from '#lib/data/store.svelte.js'
  import { listLocations } from '#lib/data/warehouses.js'
  import { resolve } from '$app/paths'

  const locations = $derived(listLocations(store))
</script>

<PageLayout>
  <PageHeader
    title="Warehouses"
    description="Capacity and docks at each of the {locations.length} sites. Zones above 85% are marked."
  >
    {#snippet actions()}
      <Button href={resolve('/warehouses/new')}><Plus />New site</Button>
    {/snippet}
  </PageHeader>
  <CardGrid columns={2}>
    {#each locations as location (location.id)}
      <WarehouseCard {location} />
    {/each}
  </CardGrid>
</PageLayout>
