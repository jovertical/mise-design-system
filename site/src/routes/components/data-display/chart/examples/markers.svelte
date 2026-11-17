<!--
  A dot on each point, for a short series where each day is read on its own,
  and a y-domain that starts near the data so the movement shows.
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
  import { Area, AreaChart, Points } from 'layerchart'

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
  <CardHeader><CardTitle>Order completion</CardTitle></CardHeader>
  <CardContent>
    <ChartContainer {config} class="aspect-auto h-[260px] w-full">
      <AreaChart
        data={week}
        x="day"
        xScale={scalePoint().padding(0.2)}
        yDomain={[100, 210]}
        grid={chartGrid}
        series={[{ key: 'completed', label: 'Completed', color: 'var(--color-completed)' }]}
        {tooltip}
      >
        {#snippet marks()}
          <Area
            seriesKey="completed"
            y0={() => 100}
            curve={curveMonotoneX}
            fill="var(--color-completed)"
            fillOpacity={chartAreaFillOpacity}
            line={{ stroke: 'var(--color-completed)', strokeWidth: chartLineStrokeWidth }}
          />
          <Points seriesKey="completed" r={3} fill="var(--color-completed)" />
        {/snippet}
      </AreaChart>
    </ChartContainer>
  </CardContent>
</Card>
