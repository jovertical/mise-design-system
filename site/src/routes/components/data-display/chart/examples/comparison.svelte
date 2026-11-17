<!--
  A comparison series behind the one that matters: muted and dashed with
  `chartComparisonSeriesClass`, so it reads as context. A legend names both.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    chartComparisonSeriesClass,
    chartGrid,
    chartLineStrokeWidth,
  } from '@jovertical/mise-design-system'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { LineChart } from 'layerchart'

  const week = [
    { day: 'Tue', completed: 132, placed: 158 },
    { day: 'Wed', completed: 148, placed: 171 },
    { day: 'Thu', completed: 151, placed: 190 },
    { day: 'Fri', completed: 178, placed: 205 },
    { day: 'Sat', completed: 174, placed: 198 },
    { day: 'Sun', completed: 121, placed: 130 },
  ]

  const config = {
    completed: { label: 'Completed', color: 'var(--chart-1)' },
    placed: { label: 'Orders placed', color: 'var(--chart-2)' },
  } satisfies ChartConfig
</script>

{#snippet tooltip()}
  <ChartTooltip indicator="line" />
{/snippet}

<Card class="w-full max-w-3xl">
  <CardHeader><CardTitle>Completed against placed</CardTitle></CardHeader>
  <CardContent>
    <ChartContainer {config} class="aspect-auto h-[260px] w-full">
      <LineChart
        data={week}
        x="day"
        xScale={scalePoint().padding(0.2)}
        grid={chartGrid}
        yNice={4}
        legend
        series={[
          {
            key: 'completed',
            label: 'Completed',
            color: 'var(--color-completed)',
            props: { strokeWidth: chartLineStrokeWidth },
          },
          {
            key: 'placed',
            label: 'Orders placed',
            color: 'var(--muted-foreground)',
            props: { strokeWidth: chartLineStrokeWidth, class: chartComparisonSeriesClass },
          },
        ]}
        props={{ spline: { curve: curveMonotoneX } }}
        {tooltip}
      />
    </ChartContainer>
  </CardContent>
</Card>
