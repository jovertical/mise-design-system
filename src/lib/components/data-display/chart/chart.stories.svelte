<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { Area, AreaChart, LineChart, Points } from 'layerchart'

  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import ChartContainer from './chart.svelte'
  import {
    chartAreaFillOpacity,
    chartComparisonSeriesClass,
    chartGrid,
    chartLineStrokeWidth,
  } from './chart-defaults.js'
  import ChartTooltip from './chart-tooltip.svelte'
  import type { ChartConfig } from './chart-utils.js'

  const { Story } = defineMeta({
    title: 'Data display/Chart',
    component: ChartContainer,
    tags: ['shadcn'],
  })

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

{#snippet dotTooltip()}
  <ChartTooltip indicator="dot" />
{/snippet}
{#snippet lineTooltip()}
  <ChartTooltip indicator="line" />
{/snippet}

<!--
  An area over the week: horizontal grid lines only, quiet axes, a light wash
  under a solid line. Colours come from the config as `--color-<key>`.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-3xl">
      <CardHeader><CardTitle>Sales performance</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer class="aspect-auto h-[260px] w-full" {...args} {config}>
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
            tooltip={dotTooltip}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  A comparison series behind the one that matters: muted and dashed, so it
  reads as context. A legend names both.
-->
<Story name="With comparison" asChild>
  <Card class="max-w-3xl">
    <CardHeader><CardTitle>Completed orders trend</CardTitle></CardHeader>
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
          tooltip={lineTooltip}
        />
      </ChartContainer>
    </CardContent>
  </Card>
</Story>

<!--
  A dot on each point, for a short series where each day is read on its own,
  and a y-domain that starts near the data so the movement is visible.
-->
<Story name="With markers" asChild>
  <Card class="max-w-3xl">
    <CardHeader><CardTitle>Order completion trend</CardTitle></CardHeader>
    <CardContent>
      <ChartContainer {config} class="aspect-auto h-[260px] w-full">
        <AreaChart
          data={week}
          x="day"
          xScale={scalePoint().padding(0.2)}
          yDomain={[100, 210]}
          grid={chartGrid}
          series={[{ key: 'completed', label: 'Completed', color: 'var(--color-completed)' }]}
          tooltip={dotTooltip}
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
</Story>

<!-- The five series colours, `--chart-1` to `--chart-5`, which a config points at. -->
<Story name="Series palette" asChild>
  <div class="flex flex-wrap gap-4">
    {#each [1, 2, 3, 4, 5] as index (index)}
      <div class="flex items-center gap-2 text-sm">
        <span
          class="size-6 rounded-md"
          style:background="var(--chart-{index})"
          aria-hidden="true"
        ></span>
        --chart-{index}
      </div>
    {/each}
  </div>
</Story>
