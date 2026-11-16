<!-- In a card header, beside the title, as a range switch: the shortest labels in the system live here. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Tabs,
    TabsList,
    TabsTrigger,
  } from '@jovertical/mise-design-system'

  let range = $state('30d')
</script>

<Card class="w-full max-w-2xl">
  <CardHeader>
    <CardTitle>Stock turnover</CardTitle>
    <div class="col-start-2 row-span-2 row-start-1 justify-self-end">
      <Tabs bind:value={range}>
        <TabsList>
          <TabsTrigger value="30d">30D</TabsTrigger>
          <TabsTrigger value="90d">90D</TabsTrigger>
          <TabsTrigger value="12m">12M</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </CardHeader>
  <CardContent class="text-muted-foreground text-sm">
    Average stock turns over the selected period.
  </CardContent>
</Card>
