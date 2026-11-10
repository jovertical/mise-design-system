<!-- The overview's chart: orders delivered against orders placed, each of the last seven days. -->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    chartAreaFillOpacity,
    chartGrid,
    chartLineStrokeWidth,
  } from '@jovertical/mise-design-system'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { AreaChart } from 'layerchart'

  import { deliveredThisWeek, deliveryTrend } from '#lib/data/overview.js'
  import { store } from '#lib/data/store.svelte.js'

  let { class: className }: { class?: string } = $props()

  const trend = $derived(deliveryTrend(store))
  const week = $derived(deliveredThisWeek(store))

  const config = {
    delivered: { label: 'Delivered', color: 'var(--chart-1)' },
    placed: { label: 'Placed', color: 'var(--chart-2)' },
  } satisfies ChartConfig
</script>

{#snippet tooltip()}
  <ChartTooltip indicator="dot" />
{/snippet}

<Card class={className}>
  <CardHeader>
    <CardTitle>Deliveries, last 7 days</CardTitle>
    <CardDescription>{week.count} delivered, against orders placed.</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer class="aspect-auto h-[240px] w-full" {config}>
      <AreaChart
        data={trend}
        x="day"
        xScale={scalePoint().padding(0.2)}
        grid={chartGrid}
        yNice={4}
        series={[
          { key: 'delivered', label: 'Delivered', color: 'var(--color-delivered)' },
          { key: 'placed', label: 'Placed', color: 'var(--color-placed)' },
        ]}
        props={{
          area: {
            curve: curveMonotoneX,
            fillOpacity: chartAreaFillOpacity,
            line: { strokeWidth: chartLineStrokeWidth },
          },
        }}
        {tooltip}
      />
    </ChartContainer>
  </CardContent>
</Card>
