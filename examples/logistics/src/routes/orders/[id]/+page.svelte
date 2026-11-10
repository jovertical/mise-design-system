<!--
  One order: what it is, what is in it, where it is going and what has
  happened to it. An unknown number renders ErrorState, not a blank page.
-->
<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AsideCard,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    ErrorState,
    FactList,
    FactListItem,
    PageHeader,
    PageLayout,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
    toast,
  } from '@jovertical/mise-design-system'
  import Ban from '@lucide/svelte/icons/ban'
  import CircleCheck from '@lucide/svelte/icons/circle-check'
  import FilePlus from '@lucide/svelte/icons/file-plus'
  import PackageCheck from '@lucide/svelte/icons/package-check'
  import Pencil from '@lucide/svelte/icons/pencil'
  import Printer from '@lucide/svelte/icons/printer'
  import Truck from '@lucide/svelte/icons/truck'
  import type { Component } from 'svelte'
  import { clientOf, locationName } from '#modules/core/data/lookups.js'
  import { store } from '#modules/core/data/store.svelte.js'
  import { dateTime, money, weight } from '#modules/core/utils/format.js'
  import { cancelOrder, getOrder, isOrderEditable } from '#modules/orders/data/index.js'
  import type { OrderStatus } from '#modules/orders/data/types.js'
  import { ORDER_STATUS, SERVICE_LABEL, SOURCE_LABEL } from '#modules/orders/utils/status.js'
  import { getShipment } from '#modules/shipments/data/index.js'
  import { SHIPMENT_STATUS } from '#modules/shipments/utils/status.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const EVENT_ICON: Record<OrderStatus, Component> = {
    received: FilePlus,
    ready: PackageCheck,
    'in-fulfilment': Truck,
    completed: CircleCheck,
    cancelled: Ban,
  }

  const order = $derived(getOrder(store, page.params.id ?? ''))
  const client = $derived(order ? clientOf(store, order.clientId) : undefined)
  const shipment = $derived(order?.shipmentId ? getShipment(store, order.shipmentId) : undefined)
  const totalWeight = $derived(order?.packages.reduce((sum, item) => sum + item.weightKg, 0) ?? 0)
  const cancellable = $derived(order?.status !== 'completed' && order?.status !== 'cancelled')

  let cancelling = $state(false)

  function confirmCancel() {
    if (!order) return

    cancelOrder(store, order.id)

    toast.success(`Order ${order.number} cancelled`)
  }
</script>

{#snippet backToOrders()}
  <Button href={resolve('/orders')}>Back to orders</Button>
{/snippet}

{#if !order}
  <PageLayout>
    <ErrorState
      status={404}
      title="No such order"
      description="That order number does not exist, or the demo data was reset."
      homeLink={backToOrders}
    />
  </PageLayout>
{:else}
  {#snippet status()}
    <Badge tone={ORDER_STATUS[order.status].tone}>{ORDER_STATUS[order.status].label}</Badge>
  {/snippet}
  {#snippet actions()}
    <Button variant="outline" onclick={() => window.print()}><Printer />Print</Button>
    {#if isOrderEditable(order)}
      <Button variant="outline" href={resolve('/orders/[id]/edit', { id: order.number })}>
        <Pencil />Edit
      </Button>
    {/if}
    <Button
      variant="outline"
      tone="critical"
      disabled={!cancellable}
      onclick={() => (cancelling = true)}
    >
      Cancel order
    </Button>
  {/snippet}
  {#snippet truckIcon()}
    <Truck />
  {/snippet}

  <PageLayout>
    <PageHeader
      title={order.number}
      description="{client?.name ?? '—'} · placed {dateTime(order.placedAt)} via {SOURCE_LABEL[
        order.source
      ]}"
      titleAccessory={status}
      {actions}
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <div class="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent>
            <FactList>
              <FactListItem label="Client" value={client?.name} />
              <FactListItem label="Service" value={SERVICE_LABEL[order.service]} />
              <FactListItem label="Ships from" value={locationName(store, order.originId)} />
              <FactListItem label="Deliver to" value={order.destination} />
              <FactListItem label="Weight" value={weight(totalWeight)} />
              <FactListItem label="Total" value={money(order.total)} />
            </FactList>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Packages</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Contents</TableHead>
                  <TableHead numeric>Weight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each order.packages as item (item.label)}
                  <TableRow>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>{item.contents}</TableCell>
                    <TableCell numeric>{weight(item.weightKg)}</TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div class="flex flex-col gap-4">
        <AsideCard title="Shipment" icon={truckIcon}>
          {#if shipment}
            <div class="flex items-center justify-between gap-2">
              <a
                class="font-medium underline-offset-4 hover:underline"
                href={resolve('/shipments/[id]', { id: shipment.number })}
              >
                {shipment.number}
              </a>
              <Badge tone={SHIPMENT_STATUS[shipment.status].tone}
                >{SHIPMENT_STATUS[shipment.status].label}</Badge
              >
            </div>
          {:else}
            <p class="text-muted-foreground text-sm">Not on a shipment yet.</p>
          {/if}
        </AsideCard>

        <Card>
          <CardHeader><CardTitle>History</CardTitle></CardHeader>
          <CardContent>
            <Timeline>
              {#each order.events.toReversed() as event, index (index)}
                {@const Icon = EVENT_ICON[event.status]}
                <TimelineItem>
                  <TimelineDot tone={ORDER_STATUS[event.status].tone}><Icon /></TimelineDot>
                  {#if index < order.events.length - 1}
                    <TimelineConnector />
                  {/if}
                  <TimelineTitle>{ORDER_STATUS[event.status].label}</TimelineTitle>
                  <TimelineContent><p>{dateTime(event.at)}</p></TimelineContent>
                </TimelineItem>
              {/each}
            </Timeline>
          </CardContent>
        </Card>
      </div>
    </div>
  </PageLayout>

  <AlertDialog bind:open={cancelling}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Cancel {order.number}?</AlertDialogTitle>
        <AlertDialogDescription>The client is not told automatically.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep the order</AlertDialogCancel>
        <AlertDialogAction tone="critical" onclick={confirmCancel}>Cancel order</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
{/if}
