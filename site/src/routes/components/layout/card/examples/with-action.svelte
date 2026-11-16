<!--
  CardAction is the header's right-hand slot: a link out, a filter, a period
  switch. It takes a second grid column, so the title keeps its own width.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-full max-w-lg">
  <CardHeader>
    <CardTitle>Stock turnover</CardTitle>
    <CardDescription>Average stock turns over the selected period.</CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">View all</Button>
    </CardAction>
  </CardHeader>
  <CardContent class="text-muted-foreground text-sm">5.8× this period.</CardContent>
</Card>
