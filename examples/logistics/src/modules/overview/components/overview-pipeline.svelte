<!-- The overview's fulfilment pipeline: orders packed, shipped and delivered, and how many of each are urgent. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    MetricBar,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import { pipeline, pipelineUrgency } from '#modules/overview/data/index.js'

  const flow = $derived(pipeline(store))
  const urgency = $derived(pipelineUrgency(store))
</script>

<Card>
  <CardHeader>
    <CardTitle>Fulfilment pipeline</CardTitle>
    <CardDescription
      >{flow.packed.count + flow.shipped.count + flow.delivered.count}
      orders across every stage.</CardDescription
    >
  </CardHeader>
  <CardContent>
    <Tabs value="packed">
      <TabsList>
        <TabsTrigger value="packed">Packed</TabsTrigger>
        <TabsTrigger value="shipped">Shipped</TabsTrigger>
        <TabsTrigger value="delivered">Delivered</TabsTrigger>
      </TabsList>
      {#each ['packed', 'shipped', 'delivered'] as const as stage (stage)}
        <TabsContent value={stage} class="flex flex-col gap-4 pt-4">
          <MetricBar
            label="Orders"
            value={flow[stage].count}
            percent={flow[stage].share}
            description="Share of all open and completed orders"
          />
          <MetricBar
            label="Express and same day"
            description="Share of this stage"
            value={urgency[stage].count}
            percent={urgency[stage].share}
            tone="info"
          />
        </TabsContent>
      {/each}
    </Tabs>
  </CardContent>
</Card>
