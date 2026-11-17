<script lang="ts">
  import { MetricGrid, type MetricGridItem } from '@jovertical/mise-design-system'

  const items: MetricGridItem[] = [
    { id: '1', label: 'Dock 1', value: '18 / 24', percent: 75, trailing: '75%' },
    { id: '2', label: 'Dock 2', value: '20 / 24', percent: 83, trailing: '83%' },
    { id: '3', label: 'Dock 3', value: '6 / 24', percent: 25, trailing: '25%' },
    { id: '4', label: 'Dock 4', value: '22 / 24', percent: 92, tone: 'warning', trailing: '92%' },
  ]
</script>

<MetricGrid class="w-[28rem]" columns={2} {items} />
