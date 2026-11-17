<script lang="ts">
  import { DeltaBadge, Sparkline, StatTile } from '@jovertical/mise-design-system'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
</script>

{#snippet icon()}
  <IconShoppingCart />
{/snippet}

{#snippet delta()}
  <DeltaBadge value={15.7} />
{/snippet}

{#snippet visual()}
  <Sparkline data={[4, 6, 5, 9, 8, 12, 11, 15]} height={36} />
{/snippet}

<StatTile
  class="w-96"
  label="Transactions"
  value="1,284"
  unit="orders"
  description="Across 12 locations"
  rows={[{ id: 'busiest', label: 'Busiest location', value: 'Harbour St' }]}
  {icon}
  {delta}
  {visual}
/>
