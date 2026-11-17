<script lang="ts">
  import { MetricRow } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
</script>

{#snippet icon()}
  <IconBuildingWarehouse />
{/snippet}

<MetricRow
  class="w-[30rem]"
  {icon}
  label="Riverside"
  description="North district · 22 items"
  stats={[
    { id: 'available', label: 'Available', value: '80%' },
    { id: 'low', label: 'Low stock', value: 3, tone: 'warning' },
  ]}
  percent={80}
  trailing="398 / 500 units"
/>
