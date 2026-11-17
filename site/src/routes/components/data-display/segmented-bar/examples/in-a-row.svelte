<!--
  `size="sm"` is the same data at table-row scale: a rule, with no captions or
  shares, for a cell whose exact figures are the columns either side.
-->
<script lang="ts">
  import { Card, CardContent, SegmentedBar } from '@jovertical/mise-design-system'

  const locations = [
    { name: 'Main', available: 280, reserved: 92, inTransit: 40 },
    { name: 'Warehouse', available: 18, reserved: 0, inTransit: 120 },
  ]
</script>

<Card class="w-full max-w-md">
  <CardContent stack="md">
    {#each locations as location (location.name)}
      <div class="flex items-center gap-6">
        <span class="w-32 text-sm font-medium">{location.name}</span>
        <SegmentedBar
          class="w-24"
          size="sm"
          segments={[
            { label: 'Available', value: location.available, tone: 'primary' },
            { label: 'Reserved', value: location.reserved, tone: 'warning' },
            { label: 'In transit', value: location.inTransit, tone: 'neutral' },
          ]}
        />
      </div>
    {/each}
  </CardContent>
</Card>
