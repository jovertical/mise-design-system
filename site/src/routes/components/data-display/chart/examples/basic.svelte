<!--
  An area over the week: horizontal grid lines only, quiet axes, a light wash
  under a solid line. The config's colours are written as `--color-<key>`.
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
    chartAreaFillOpacity,
    chartGrid,
    chartLineStrokeWidth,
  } from '@jovertical/mise-design-system'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { AreaChart } from 'layerchart'

  const week = [
    { day: 'Tue', completed: 132 },
    { day: 'Wed', completed: 148 },
    { day: 'Thu', completed: 151 },
    { day: 'Fri', completed: 178 },
    { day: 'Sat', completed: 174 },
    { day: 'Sun', completed: 121 },
  ]

  const config = {
    completed: { label: 'Completed', color: 'var(--chart-1)' },
  } satisfies ChartConfig
</script>

{#snippet tooltip()}
  <ChartTooltip indicator="dot" />
{/snippet}

<Card class="w-full max-w-3xl">
  <CardHeader><CardTitle>Orders completed</CardTitle></CardHeader>
  <CardContent>
    <ChartContainer {config} class="aspect-auto h-[260px] w-full">
      <AreaChart
        data={week}
        x="day"
        xScale={scalePoint().padding(0.2)}
        grid={chartGrid}
        yNice={4}
        series={[{ key: 'completed', label: 'Completed', color: 'var(--color-completed)' }]}
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
