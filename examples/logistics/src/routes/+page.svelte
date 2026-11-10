<!--
  Operations overview: the day at a glance. Every figure is a repository
  function of the store; the page only arranges them.
-->
<script lang="ts">
  import {
    Button,
    DeltaBadge,
    PageHeader,
    PageLayout,
    Sparkline,
    StatTile,
  } from '@jovertical/mise-design-system'
  import { latency } from '#modules/core/data/latency.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { fleetStatus } from '#modules/fleet/data/index.js'
  import OverviewActiveShipments from '#modules/overview/components/overview-active-shipments.svelte'
  import OverviewDeliveries from '#modules/overview/components/overview-deliveries.svelte'
  import OverviewFleetCondition from '#modules/overview/components/overview-fleet-condition.svelte'
  import OverviewFleetStatus from '#modules/overview/components/overview-fleet-status.svelte'
  import OverviewPipeline from '#modules/overview/components/overview-pipeline.svelte'
  import { deliveredThisWeek, deliveryTrend, ordersToday } from '#modules/overview/data/index.js'
  import { activeShipments } from '#modules/shipments/data/index.js'

  let loading = $state(true)

  $effect(() => {
    latency().then(() => (loading = false))
  })

  const fleet = $derived(fleetStatus(store))
  const trend = $derived(deliveryTrend(store))
  const active = $derived(activeShipments(store))
  const idle = $derived(fleet.idle.count)
  const today = $derived(ordersToday(store))
  const week = $derived(deliveredThisWeek(store))
</script>

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
    <OverviewFleetStatus />
    <OverviewPipeline />
  </div>

  <div class="grid gap-4 lg:grid-cols-3">
    <OverviewDeliveries class="lg:col-span-2" />
    <OverviewFleetCondition />
  </div>

  <OverviewActiveShipments {loading} />
</PageLayout>
