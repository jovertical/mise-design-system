<!--
  Operations overview: the day at a glance. Every figure is a repository
  function of the store; the page only arranges them.
-->
<script lang="ts">
  import {
    Badge,
    Button,
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
    DataTable,
    DeltaBadge,
    dataTableColumns,
    FactList,
    FactListItem,
    MetricBar,
    PageHeader,
    PageLayout,
    Progress,
    RadialStat,
    SegmentedBar,
    Sparkline,
    StatTile,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from '@jovertical/mise-design-system'
  import { renderSnippet } from '@tanstack/svelte-table'
  import { scalePoint } from 'd3-scale'
  import { curveMonotoneX } from 'd3-shape'
  import { AreaChart } from 'layerchart'
  import { CONDITIONS, fleetCondition, fleetStatus, VEHICLE_STATUSES } from '#lib/data/fleet.js'
  import { latency } from '#lib/data/latency.js'
  import { driverOf, locationName, vehicleOf } from '#lib/data/lookups.js'
  import {
    deliveredThisWeek,
    deliveryTrend,
    ordersToday,
    pipeline,
    pipelineUrgency,
  } from '#lib/data/overview.js'
  import { activeShipments, shipmentProgress } from '#lib/data/shipments.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Shipment } from '#lib/data/types.js'
  import { dateTime } from '#lib/format.js'
  import { CONDITION, SHIPMENT_STATUS, VEHICLE_STATUS } from '#lib/status.js'
  import { resolve } from '$app/paths'

  let loading = $state(true)
  $effect(() => {
    latency().then(() => (loading = false))
  })

  const fleet = $derived(fleetStatus(store))
  const condition = $derived(fleetCondition(store))
  const flow = $derived(pipeline(store))
  const urgency = $derived(pipelineUrgency(store))
  const trend = $derived(deliveryTrend(store))
  const active = $derived(activeShipments(store))
  const idle = $derived(fleet.idle.count)
  const today = $derived(ordersToday(store))
  const week = $derived(deliveredThisWeek(store))

  const segments = $derived(
    VEHICLE_STATUSES.map((status) => ({
      label: VEHICLE_STATUS[status].label,
      value: fleet[status].count,
      tone: VEHICLE_STATUS[status].tone,
    })),
  )

  const config = {
    delivered: { label: 'Delivered', color: 'var(--chart-1)' },
    placed: { label: 'Placed', color: 'var(--chart-2)' },
  } satisfies ChartConfig

  const nextStop = (shipment: Shipment) =>
    shipment.stops.find((stop) => !stop.deliveredAt) ?? shipment.stops.at(-1)

  const column = dataTableColumns<Shipment>()
  const columns = column.columns([
    column.display({
      id: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => renderSnippet(vehicleCell, row.original),
    }),
    column.accessor('number', { header: 'Shipment' }),
    column.display({
      id: 'route',
      header: 'Route',
      cell: ({ row }) => renderSnippet(routeCell, row.original),
    }),
    column.display({
      id: 'eta',
      header: 'Next ETA',
      cell: ({ row }) => dateTime(nextStop(row.original)?.eta ?? { day: 0, time: '—' }),
    }),
    column.display({
      id: 'status',
      header: 'Status',
      cell: ({ row }) => renderSnippet(statusCell, row.original),
    }),
    column.display({
      id: 'progress',
      header: 'Progress',
      cell: ({ row }) => renderSnippet(progressCell, row.original),
    }),
  ])
</script>

{#snippet vehicleCell(shipment: Shipment)}
  <div class="flex flex-col">
    <span class="font-medium">{vehicleOf(store, shipment.vehicleId)?.code}</span>
    <span class="text-muted-foreground text-xs">{driverOf(store, shipment.driverId)?.name}</span>
  </div>
{/snippet}
{#snippet routeCell(shipment: Shipment)}
  <span class="text-muted-foreground"
    >{locationName(store, shipment.originId)}
    → {nextStop(shipment)?.address}</span
  >
{/snippet}
{#snippet statusCell(shipment: Shipment)}
  <Badge tone={SHIPMENT_STATUS[shipment.status].tone}
    >{SHIPMENT_STATUS[shipment.status].label}</Badge
  >
{/snippet}
{#snippet progressCell(shipment: Shipment)}
  <Progress value={shipmentProgress(shipment)} class="w-24" aria-label="Stops delivered" />
{/snippet}
{#snippet viewAll()}
  <Button variant="ghost" size="sm" href={resolve('/shipments')}>View all shipments</Button>
{/snippet}
{#snippet exportAction()}
  <Button variant="outline">Export</Button>
{/snippet}
{#snippet ordersDelta()}
  <DeltaBadge value={today.change} />
{/snippet}
{#snippet ordersTrend()}
  <Sparkline data={trend.map((day) => day.placed)} tone="success" height={36} />
{/snippet}
{#snippet weekDelta()}
  <DeltaBadge value={week.change} />
{/snippet}
{#snippet weekTrend()}
  <Sparkline data={trend.map((day) => day.delivered)} height={36} />
{/snippet}
{#snippet tooltip()}
  <ChartTooltip indicator="dot" />
{/snippet}

<PageLayout>
  <PageHeader
    title="Operations overview"
    description="Riverside DC and three hubs, today."
    actions={exportAction}
  />

  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <StatTile
      label="Orders today"
      value={today.count}
      unit="placed, against the daily average"
      delta={ordersDelta}
      visual={ordersTrend}
      {loading}
    />
    <StatTile
      label="Delivered, 7 days"
      value={week.count}
      unit="orders, against the week before"
      delta={weekDelta}
      visual={weekTrend}
      {loading}
    />
    <StatTile
      label="Active shipments"
      value={active.length}
      unit="on the road or scheduled"
      {loading}
    />
    <StatTile
      label="Vehicles idle"
      value={idle}
      unit="of {store.data.vehicles.length}"
      tone={idle > 2 ? 'warning' : 'neutral'}
      {loading}
    />
  </div>

  <div class="grid gap-4 lg:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Fleet status</CardTitle>
        <CardDescription>Where every vehicle is right now.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <SegmentedBar {segments} />
        <FactList>
          {#each VEHICLE_STATUSES as status (status)}
            <FactListItem
              label={VEHICLE_STATUS[status].label}
              value="{fleet[status].count} {fleet[status].count === 1 ? 'vehicle' : 'vehicles'}"
            />
          {/each}
        </FactList>
      </CardContent>
    </Card>

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
  </div>

  <div class="grid gap-4 lg:grid-cols-3">
    <Card class="lg:col-span-2">
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

    <Card>
      <CardHeader>
        <CardTitle>Fleet condition</CardTitle>
        <CardDescription>From the last inspection of each vehicle.</CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        {#each CONDITIONS as key (key)}
          <div class="flex items-center gap-3">
            <RadialStat percent={condition[key].share} tone={CONDITION[key].tone} diameter={44} />
            <div class="flex flex-col">
              <span class="text-sm font-medium">{CONDITION[key].label}</span>
              <span class="text-muted-foreground text-xs">{CONDITION[key].note}</span>
            </div>
            <span class="ml-auto text-sm tabular-nums">{condition[key].count}</span>
          </div>
        {/each}
      </CardContent>
    </Card>
  </div>

  <DataTable
    title="Active shipments"
    description="{active.length} shipments scheduled or on the road."
    {columns}
    data={active.slice(0, 5)}
    getRowId={(shipment) => shipment.id}
    isLoading={loading}
    footer={viewAll}
    withPadding={false}
  />
</PageLayout>
