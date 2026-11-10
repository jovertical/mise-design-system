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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
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
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import Flag from '@lucide/svelte/icons/flag'
  import MapPin from '@lucide/svelte/icons/map-pin'
  import Route from '@lucide/svelte/icons/route'
  import { untrack } from 'svelte'

  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import FormSection from '#lib/components/form-section.svelte'
  import ShipmentAside from '#lib/components/shipment-aside.svelte'
  import ShipmentOrders from '#lib/components/shipment-orders.svelte'
  import { locationName } from '#lib/data/lookups.js'
  import { candidateOrders, candidateVehicles, plannedStops } from '#lib/data/shipments/index.js'
  import { type ShipmentInput, shipmentSchema } from '#lib/data/shipments/schema.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Id } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'
  import { dateTime } from '#lib/format.js'

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
</script>

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
        <FormSection icon={Route} title="Run" hint="Where it leaves from, and who takes it.">
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
        </FormSection>

        <Separator />

        <ShipmentOrders {form} {orders} />

        <Separator />

        <FormSection
          icon={Flag}
          title="Stops"
          hint="One per order, in the order ticked, from 09:00 tomorrow and 45 minutes apart."
        >
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
        </FormSection>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <ShipmentAside values={$values} />
{/snippet}

<FormPage {...page} formId="shipment-form" form={body} {aside} />
