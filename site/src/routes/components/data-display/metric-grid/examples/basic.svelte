<!-- Stock split by category: sub-groups compared against each other, so they sit side by side. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    MetricGrid,
    type MetricGridItem,
  } from '@jovertical/mise-design-system'

  const items: MetricGridItem[] = [
    { id: 'produce', label: 'Produce', value: '412 items', percent: 32, trailing: '32%' },
    { id: 'dairy', label: 'Dairy', value: '268 items', percent: 21, trailing: '21%' },
    { id: 'bakery', label: 'Bakery', value: '231 items', percent: 18, trailing: '18%' },
    { id: 'frozen', label: 'Frozen', value: '193 items', percent: 15, trailing: '15%' },
    { id: 'pantry', label: 'Pantry', value: '115 items', percent: 9, trailing: '9%' },
    { id: 'drinks', label: 'Drinks', value: '65 items', percent: 5, trailing: '5%' },
  ]
</script>

<Card class="w-full">
  <CardHeader><CardTitle>Stock by category</CardTitle></CardHeader>
  <CardContent><MetricGrid {items} /></CardContent>
</Card>
