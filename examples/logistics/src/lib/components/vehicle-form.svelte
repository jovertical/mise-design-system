<!--
  The vehicle form, for New vehicle and Edit vehicle: what it is, where it is
  based and who drives it, and its service record. Status is operational and
  not edited here; a new vehicle starts idle.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardTitle,
    DatePicker,
    Input,
    NumberInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
    Text,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import MapPin from '@lucide/svelte/icons/map-pin'
  import Truck from '@lucide/svelte/icons/truck'
  import Wrench from '@lucide/svelte/icons/wrench'
  import { untrack } from 'svelte'

  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import VehicleAside from '#lib/components/vehicle-aside.svelte'
  import { dateToDay, dayToDate } from '#lib/data/days.js'
  import { assignableDrivers } from '#lib/data/fleet.js'
  import { type VehicleInput, vehicleSchema } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Id, Vehicle } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'
  import { CONDITION } from '#lib/status.js'

  let {
    initial,
    page,
    save,
    vehicleId = null,
    status = null,
  }: {
    initial: VehicleInput
    page: FormPageText
    save: (values: VehicleInput) => void
    /** The vehicle being edited, so its own driver stays on the list. */
    vehicleId?: Id | null
    status?: Vehicle['status'] | null
  } = $props()

  const form = entityForm(
    vehicleSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  // Select speaks strings and reads '' as nothing chosen, so "no driver" travels
  // as its own value and is null in the data.
  const NO_DRIVER = 'none'

  const drivers = $derived([
    { value: NO_DRIVER, label: 'No driver' },
    ...assignableDrivers(store, vehicleId).map((driver) => ({
      value: driver.id,
      label: driver.name,
    })),
  ])

  const types = [
    { value: 'van', label: 'Van' },
    { value: 'truck', label: 'Truck' },
  ]

  const sites = $derived(
    store.data.locations.map((location) => ({ value: location.id, label: location.name })),
  )

  const conditions = Object.entries(CONDITION).map(([value, look]) => ({
    value,
    label: look.label,
  }))
</script>

{#snippet vehicleIcon()}
  <Truck />
{/snippet}
{#snippet assignmentIcon()}
  <MapPin />
{/snippet}
{#snippet serviceIcon()}
  <Wrench />
{/snippet}

{#snippet heading(icon: typeof vehicleIcon, title: string, hint: string)}
  <div class="flex flex-col gap-1">
    <CardTitle {icon} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
{/snippet}

{#snippet choice(
  name: 'type' | 'homeLocationId' | 'condition',
  label: string,
  options: { value: string; label: string }[],
  required = false,
)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel {required}>{label}</FormLabel>
        <Select
          type="single"
          value={$values[name]}
          onValueChange={(next) => (($values as Record<string, unknown>)[name] = next)}
          items={options}
        >
          <SelectTrigger {...props} class="w-full">
            <SelectValue placeholder="Choose…" />
          </SelectTrigger>
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
  <form method="POST" id="vehicle-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <section class="flex flex-col gap-4">
          {@render heading(vehicleIcon, 'Vehicle', 'How the fleet knows it, and what it is.')}
          <div class="grid gap-4 sm:grid-cols-3">
            <FormField {form} name="code">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Code</FormLabel>
                  <Input
                    {...props}
                    value={$values.code}
                    oninput={(event) => ($values.code = event.currentTarget.value.toUpperCase())}
                    placeholder="VAN-030"
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="registration">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Registration</FormLabel>
                  <Input {...props} bind:value={$values.registration} placeholder="RV-2090" />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            {@render choice('type', 'Type', types)}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            assignmentIcon,
            'Assignment',
            'Where it is based and who drives it. A driver moves off any other vehicle.',
          )}
          <div class="grid gap-4 sm:grid-cols-2">
            {@render choice('homeLocationId', 'Home site', sites, true)}
            <FormField {form} name="driverId">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel>Driver</FormLabel>
                  <Select
                    type="single"
                    value={$values.driverId ?? NO_DRIVER}
                    onValueChange={(next) => ($values.driverId = next === NO_DRIVER ? null : next)}
                    items={drivers}
                  >
                    <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {#each drivers as driver (driver.value)}
                        <SelectItem value={driver.value} label={driver.label} />
                      {/each}
                    </SelectContent>
                  </Select>
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(serviceIcon, 'Service', 'Its mileage, and when it is next due in.')}
          <div class="grid gap-4 sm:grid-cols-3">
            <FormField {form} name="mileageKm">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel>Mileage</FormLabel>
                  <NumberInput
                    {...props}
                    format="integer"
                    prefix="km"
                    clearable={false}
                    bind:value={$values.mileageKm}
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="nextServiceDay">
              <FormControl>
                {#snippet children()}
                  <FormLabel>Next service</FormLabel>
                  <DatePicker
                    mode="single"
                    value={dayToDate($values.nextServiceDay)}
                    onValueChange={(date) => {
                      if (date) $values.nextServiceDay = dateToDay(date)
                    }}
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            {@render choice('condition', 'Condition', conditions)}
          </div>
        </section>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <VehicleAside values={$values} {status} />
{/snippet}

<FormPage {...page} formId="vehicle-form" form={body} {aside} />
