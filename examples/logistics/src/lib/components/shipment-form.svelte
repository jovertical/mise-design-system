<!--
  The run planner, for Plan a run and Edit run: an origin, then a vehicle and
  a driver, then the ready orders from that origin it carries. The stops
  follow from the ticked orders, in the order they were ticked. Changing the
  origin starts the choice of vehicle, driver and orders again.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardTitle,
    Checkbox,
    EmptyState,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Text,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineTitle,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormFieldset,
    FormLabel,
    FormLegend,
  } from '@jovertical/mise-design-system/form'
  import Flag from '@lucide/svelte/icons/flag'
  import ListChecks from '@lucide/svelte/icons/list-checks'
  import MapPin from '@lucide/svelte/icons/map-pin'
  import Package from '@lucide/svelte/icons/package'
  import Route from '@lucide/svelte/icons/route'
  import { untrack } from 'svelte'

  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import ShipmentAside from '#lib/components/shipment-aside.svelte'
  import { clientOf, locationName } from '#lib/data/lookups.js'
  import { candidateOrders, candidateVehicles, plannedStops } from '#lib/data/shipments/index.js'
  import { type ShipmentInput, shipmentSchema } from '#lib/data/shipments/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Id } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'
  import { dateTime, weight } from '#lib/format.js'

  let {
    initial,
    page,
    save,
    shipmentId = null,
  }: {
    initial: ShipmentInput
    page: FormPageText
    save: (values: ShipmentInput) => void
    /** The run being replanned, so its own orders and vehicle stay on offer. */
    shipmentId?: Id | null
  } = $props()

  const form = entityForm(
    shipmentSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  const origins = $derived(
    store.data.locations.map((location) => ({ value: location.id, label: location.name })),
  )

  const vehicles = $derived(
    $values.originId
      ? candidateVehicles(store, $values.originId, shipmentId).map((vehicle) => ({
          value: vehicle.id,
          label:
            vehicle.homeLocationId === $values.originId
              ? vehicle.code
              : `${vehicle.code} · ${locationName(store, vehicle.homeLocationId)}`,
        }))
      : [],
  )

  const drivers = $derived(
    store.data.drivers
      .filter((driver) => driver.availability !== 'leave' || driver.id === $values.driverId)
      .map((driver) => ({ value: driver.id, label: driver.name })),
  )

  const orders = $derived(
    $values.originId ? candidateOrders(store, $values.originId, shipmentId) : [],
  )

  const stops = $derived(plannedStops(store, $values.orderIds))

  function chooseOrigin(originId: string) {
    if (originId === $values.originId) return

    $values.originId = originId
    $values.vehicleId = ''
    $values.driverId = ''
    $values.orderIds = []
  }

  // A vehicle with a driver brings them along; the driver can still be changed.
  function chooseVehicle(vehicleId: string) {
    $values.vehicleId = vehicleId

    const driverId = store.data.vehicles.find((vehicle) => vehicle.id === vehicleId)?.driverId

    if (driverId) $values.driverId = driverId
  }

  function tick(orderId: Id, on: boolean) {
    const rest = $values.orderIds.filter((id) => id !== orderId)

    $values.orderIds = on ? [...rest, orderId] : rest
  }

  const kilograms = (orderId: Id) =>
    store.data.orders
      .find((order) => order.id === orderId)
      ?.packages.reduce((sum, pkg) => sum + pkg.weightKg, 0) ?? 0
</script>

{#snippet runIcon()}
  <Route />
{/snippet}
{#snippet ordersIcon()}
  <ListChecks />
{/snippet}
{#snippet stopsIcon()}
  <Flag />
{/snippet}
{#snippet emptyIcon()}
  <Package />
{/snippet}

{#snippet heading(icon: typeof runIcon, title: string, hint: string)}
  <div class="flex flex-col gap-1">
    <CardTitle {icon} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
{/snippet}

{#snippet choice(
  name: 'originId' | 'vehicleId' | 'driverId',
  label: string,
  options: { value: string; label: string }[],
  onchange: (value: string) => void,
  placeholder: string,
)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>{label}</FormLabel>
        <Select
          type="single"
          value={$values[name]}
          onValueChange={onchange}
          items={options}
          disabled={options.length === 0}
        >
          <SelectTrigger {...props} class="w-full"><SelectValue {placeholder} /></SelectTrigger>
          <SelectContent>
            {#each options as option (option.value)}
              <SelectItem value={option.value} label={option.label} />
            {/each}
          </SelectContent>
        </Select>
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
{/snippet}

{#snippet body()}
  <form method="POST" id="shipment-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <section class="flex flex-col gap-4">
          {@render heading(runIcon, 'Run', 'Where it leaves from, and who takes it.')}
          <div class="grid gap-4 sm:grid-cols-3">
            {@render choice('originId', 'Origin', origins, chooseOrigin, 'Choose a site…')}
            {@render choice(
              'vehicleId',
              'Vehicle',
              vehicles,
              chooseVehicle,
              $values.originId ? 'Choose a vehicle…' : 'Choose an origin first',
            )}
            {@render choice(
              'driverId',
              'Driver',
              drivers,
              (next) => ($values.driverId = next),
              'Choose a driver…',
            )}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            ordersIcon,
            'Orders',
            $values.originId
              ? `Ready orders at ${locationName(store, $values.originId)} that are on no other run.`
              : 'Choose an origin to see its ready orders.',
          )}
          <FormFieldset {form} name="orderIds" class="flex flex-col gap-3">
            <FormLegend class="sr-only">Orders on this run</FormLegend>
            {#if orders.length === 0}
              <EmptyState
                icon={emptyIcon}
                title={$values.originId ? 'No ready orders here' : 'No origin yet'}
                description={$values.originId
                  ? `Every ready order at ${locationName(store, $values.originId)} is already on a run.`
                  : 'The orders a run can carry depend on where it leaves from.'}
              />
            {:else}
              <Table compact>
                <TableHeader>
                  <TableRow>
                    <TableHead class="w-10"><span class="sr-only">On this run</span></TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Deliver to</TableHead>
                    <TableHead class="text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {#each orders as order (order.id)}
                    <TableRow>
                      <TableCell>
                        <Checkbox
                          checked={$values.orderIds.includes(order.id)}
                          onCheckedChange={(on) => tick(order.id, on === true)}
                          aria-label="Put {order.number} on this run"
                        />
                      </TableCell>
                      <TableCell class="font-medium">{order.number}</TableCell>
                      <TableCell>{clientOf(store, order.clientId)?.name}</TableCell>
                      <TableCell>{order.destination}</TableCell>
                      <TableCell class="text-right tabular-nums"
                        >{weight(kilograms(order.id))}</TableCell
                      >
                    </TableRow>
                  {/each}
                </TableBody>
              </Table>
            {/if}
            <FormFieldErrors class="empty:hidden" />
          </FormFieldset>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            stopsIcon,
            'Stops',
            'One per order, in the order ticked, from 09:00 tomorrow and 45 minutes apart.',
          )}
          {#if stops.length === 0}
            <Text size="sm" muted>Tick an order to add its stop.</Text>
          {:else}
            <Timeline>
              {#each stops as stop, index (index)}
                <TimelineItem>
                  <TimelineDot tone="primary"><MapPin /></TimelineDot>
                  {#if index < stops.length - 1}
                    <TimelineConnector />
                  {/if}
                  <TimelineTitle>{stop.address}</TimelineTitle>
                  <TimelineContent><p>Due {dateTime(stop.eta)}</p></TimelineContent>
                </TimelineItem>
              {/each}
            </Timeline>
          {/if}
        </section>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <ShipmentAside values={$values} />
{/snippet}

<FormPage {...page} formId="shipment-form" form={body} {aside} />
