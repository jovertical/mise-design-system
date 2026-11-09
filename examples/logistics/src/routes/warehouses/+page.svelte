<!-- Warehouses: one card per site, with its capacity overall and by zone. -->
<script lang="ts">
  import { CardGrid, PageHeader, PageLayout } from '@jovertical/mise-design-system'

  import WarehouseCard from '#lib/components/warehouse-card.svelte'
  import { store } from '#lib/data/store.svelte.js'
  import { listLocations } from '#lib/data/warehouses.js'

  const locations = $derived(listLocations(store))
</script>

<PageLayout>
  <PageHeader
    title="Warehouses"
    description="Capacity and docks at each of the {locations.length} sites. Zones above 85% are marked."
  />
  <CardGrid columns={2}>
    {#each locations as location (location.id)}
      <WarehouseCard {location} />
    {/each}
  </CardGrid>
</PageLayout>
