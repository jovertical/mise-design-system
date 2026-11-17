<!-- A catalogue split by stock status: one bar, because the question is how the total divides. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    type Segment,
    SegmentedBar,
  } from '@jovertical/mise-design-system'

  const stockStatus: Segment[] = [
    { label: 'Adequate', value: 412, tone: 'success' },
    { label: 'Low', value: 63, tone: 'warning' },
    { label: 'Out of stock', value: 18, tone: 'critical' },
    { label: 'Untracked', value: 96, tone: 'neutral' },
  ]
</script>

<Card class="w-full max-w-3xl">
  <CardHeader><CardTitle>Stock status</CardTitle></CardHeader>
  <CardContent><SegmentedBar segments={stockStatus} /></CardContent>
</Card>
