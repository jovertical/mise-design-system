<!--
  A day's dashboard for one location: headline figures, the trend, and a
  ranking. Everything is a mise component; the app's only classes are layout
  (the tile grid). Figures arrive formatted: mise has no opinion about
  currencies or locales.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ChartContainer,
    type ChartConfig,
    ChartTooltip,
    chartAreaFillOpacity,
    chartGrid,
    chartLineStrokeWidth,
    DeltaBadge,
    MetricBar,
    PageHeader,
    PageLayout,
    Sparkline,
    StatTile,
  } from '@jovertical/mise-design-system'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { AreaChart } from 'layerchart'

  const byHour = [
    { hour: '8am', orders: 12 },
    { hour: '10am', orders: 31 },
    { hour: '12pm', orders: 58 },
    { hour: '2pm', orders: 44 },
    { hour: '4pm', orders: 37 },
    { hour: '6pm', orders: 52 },
  ]

  const config = {
    orders: { label: 'Orders', color: 'var(--chart-1)' },
  } satisfies ChartConfig

  const locations = [
    { name: 'Riverside', sales: '$4,812', percent: 96 },
    { name: 'Harbour', sales: '$4,140', percent: 83 },
    { name: 'North yard', sales: '$3,365', percent: 67 },
    { name: 'Market street', sales: '$2,210', percent: 44 },
  ]
</script>

{#snippet salesDelta()}
  <DeltaBadge value={12.4} />
{/snippet}
{#snippet salesTrend()}
  <Sparkline data={[18, 22, 21, 27, 25, 31, 34]} tone="success" height={36} />
{/snippet}
{#snippet refundsDelta()}
  <DeltaBadge value={3.1} invert />
{/snippet}
{#snippet exportButton()}
  <Button variant="outline">Export</Button>
{/snippet}
{#snippet tooltip()}
  <ChartTooltip indicator="dot" />
{/snippet}

<PageLayout>
  <PageHeader
    title="Today"
    description="Riverside, since the register opened at 7:30am."
    actions={exportButton}
  />

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <StatTile
      label="Sales"
      value="$14,527"
      exactValue="$14,527.40"
      delta={salesDelta}
      visual={salesTrend}
    />
    <StatTile label="Orders" value={234} unit="orders" />
    <StatTile label="Average basket" value="$62.08" unit="per order" />
    <StatTile label="Refunds" value="$318" delta={refundsDelta} tone="warning" />
  </div>

  <Card>
    <CardHeader>
      <CardTitle>Orders by hour</CardTitle>
      <CardDescription>Placed at every register, all channels.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer class="aspect-auto h-[240px] w-full" {config}>
        <AreaChart
          data={byHour}
          x="hour"
          xScale={scalePoint().padding(0.2)}
          grid={chartGrid}
          yNice={4}
          series={[{ key: 'orders', label: 'Orders', color: 'var(--color-orders)' }]}
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

  <Card>
    <CardHeader>
      <CardTitle>Sales by location</CardTitle>
      <CardDescription>Against each location's daily target.</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      {#each locations as location, index (location.name)}
        <MetricBar
          rank={index + 1}
          label={location.name}
          value={location.sales}
          percent={location.percent}
        />
      {/each}
    </CardContent>
  </Card>
</PageLayout>
