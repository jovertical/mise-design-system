<!--
  The new-order form, for the Create order sheet. Plain Field state validated
  with the shared schema, as an Inertia or plain Svelte app would: mise draws
  the fields and errors, the schema decides what is valid.
-->
<script lang="ts">
  import {
    Button,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    NumberInput,
    QuantityInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  import { type OrderInput, orderSchema } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Order } from '#lib/data/types.js'
  import { SERVICE_LABEL } from '#lib/status.js'

  type Draft = {
    clientId: string
    service: Order['service']
    originId: string
    destination: string
    weightKg: number | null
    total: number | null
  }

  let {
    onsubmit,
    oncancel,
  }: {
    onsubmit: (input: OrderInput) => void
    oncancel: () => void
  } = $props()

  let draft = $state<Draft>({
    clientId: '',
    service: 'regular',
    originId: 'loc-riverside',
    destination: '',
    weightKg: null,
    total: null,
  })
  let unit = $state('kg')
  let search = $state('')
  let errors = $state<Partial<Record<keyof Draft, string>>>({})

  const clients = $derived(
    store.data.clients
      .filter((client) => client.status === 'active')
      .map((client) => ({ value: client.id, label: client.name })),
  )
  const matching = $derived(
    clients.filter((client) => client.label.toLowerCase().includes(search.trim().toLowerCase())),
  )
  const services = Object.entries(SERVICE_LABEL).map(([value, label]) => ({ value, label }))
  const origins = $derived(
    store.data.locations.map((location) => ({ value: location.id, label: location.name })),
  )
  const units = [
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg' },
    { value: 'lb', label: 'Pound (lb)', short: 'lb' },
  ]

  const fieldError = (field: keyof Draft) => (errors[field] ? [{ message: errors[field] }] : [])

  function submit(event: SubmitEvent) {
    event.preventDefault()
    const weightKg =
      draft.weightKg === null ? 0 : unit === 'lb' ? draft.weightKg * 0.4536 : draft.weightKg
    const { weightKg: _, ...rest } = draft
    const result = orderSchema.safeParse({
      ...rest,
      packages: [{ contents: 'General freight', weightKg }],
      total: draft.total ?? -1,
    })
    if (!result.success) {
      errors = Object.fromEntries(
        result.error.issues.map((issue) => [
          issue.path[0] === 'packages' ? 'weightKg' : issue.path[0],
          issue.message,
        ]),
      )
      if (draft.total === null) errors.total = 'Enter the order total'
      return
    }
    errors = {}
    onsubmit(result.data)
  }
</script>

<form onsubmit={submit} class="flex flex-col gap-6" novalidate>
  <FieldGroup>
    <Field data-invalid={errors.clientId ? 'true' : undefined}>
      <FieldLabel for="order-client" required>Client</FieldLabel>
      <Combobox type="single" bind:value={draft.clientId} items={clients}>
        <ComboboxInput
          id="order-client"
          placeholder="Search clients…"
          aria-invalid={errors.clientId ? 'true' : undefined}
          oninput={(event) => (search = event.currentTarget.value)}
        />
        <ComboboxContent>
          {#if matching.length === 0}
            <ComboboxEmpty>No clients found.</ComboboxEmpty>
          {/if}
          <ComboboxList>
            {#each matching as client (client.value)}
              <ComboboxItem value={client.value} label={client.label} />
            {/each}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError errors={fieldError('clientId')} />
    </Field>

    <div class="grid gap-4 sm:grid-cols-2">
      <Field>
        <FieldLabel for="order-service">Service</FieldLabel>
        <Select type="single" bind:value={draft.service} items={services}>
          <SelectTrigger id="order-service" class="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {#each services as service (service.value)}
              <SelectItem value={service.value} label={service.label} />
            {/each}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel for="order-origin">Ships from</FieldLabel>
        <Select type="single" bind:value={draft.originId} items={origins}>
          <SelectTrigger id="order-origin" class="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {#each origins as origin (origin.value)}
              <SelectItem value={origin.value} label={origin.label} />
            {/each}
          </SelectContent>
        </Select>
      </Field>
    </div>

    <Field data-invalid={errors.destination ? 'true' : undefined}>
      <FieldLabel for="order-destination" required>Deliver to</FieldLabel>
      <Input
        id="order-destination"
        bind:value={draft.destination}
        placeholder="Street and number"
        aria-invalid={errors.destination ? 'true' : undefined}
      />
      <FieldError errors={fieldError('destination')} />
    </Field>

    <div class="grid gap-4 sm:grid-cols-2">
      <Field data-invalid={errors.weightKg ? 'true' : undefined}>
        <FieldLabel>Weight</FieldLabel>
        <QuantityInput
          {units}
          layout="quantity-first"
          bind:unit
          bind:quantity={draft.weightKg}
          quantityPlaceholder="0"
        />
        <FieldError errors={fieldError('weightKg')} />
      </Field>
      <Field data-invalid={errors.total ? 'true' : undefined}>
        <FieldLabel for="order-total" required>Total</FieldLabel>
        <NumberInput
          id="order-total"
          format="currency"
          prefix="$"
          bind:value={draft.total}
          aria-invalid={errors.total ? 'true' : undefined}
        />
        <FieldError errors={fieldError('total')} />
      </Field>
    </div>
  </FieldGroup>

  <div class="flex justify-end gap-2">
    <Button type="button" variant="outline" onclick={oncancel}>Cancel</Button>
    <Button type="submit">Create order</Button>
  </div>
</form>
