<script lang="ts">
  import {
    Button,
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@jovertical/mise-design-system'
</script>

<Card class="w-[26rem]">
  <CardHeader>
    <CardTitle>Stock turnover</CardTitle>
    <CardDescription>Average turns over the period.</CardDescription>
    <CardAction><Button variant="outline" size="sm">View all</Button></CardAction>
  </CardHeader>
  <CardContent class="text-muted-foreground text-sm">5.8× this period.</CardContent>
  <CardFooter variant="muted" divided>Updated 2 minutes ago</CardFooter>
</Card>
