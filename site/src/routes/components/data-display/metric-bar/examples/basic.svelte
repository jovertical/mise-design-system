<!-- One measure, stated and then drawn: the figure is the answer, the bar its picture. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    MetricBar,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-md">
  <CardHeader><CardTitle>Items by status</CardTitle></CardHeader>
  <CardContent stack="md">
    <MetricBar label="Active" value="589" percent={76} />
    <MetricBar label="Discontinued" value="112" percent={14} />
    <MetricBar label="Inactive" value="41" percent={5} />
    <MetricBar label="Draft" value="34" percent={4} />
  </CardContent>
</Card>
