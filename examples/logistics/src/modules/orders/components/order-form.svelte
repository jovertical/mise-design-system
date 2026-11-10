<!--
  The order form, for New order and Edit order: who it is for, where it goes,
  what it carries and what it costs, with a summary and what is still missing
  beside it. One superForm from entityForm; mise/form draws the fields and
  their errors, the shared schema decides what is valid.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    Input,
    NumberInput,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import Banknote from '@lucide/svelte/icons/banknote'
  import Route from '@lucide/svelte/icons/route'
  import Users from '@lucide/svelte/icons/users'
  import { untrack } from 'svelte'
  import FormPage, { type FormPageText } from '#modules/core/components/form-page.svelte'
  import FormSection from '#modules/core/components/form-section.svelte'
  import { store } from '#modules/core/data/store.svelte.js'
  import { entityForm } from '#modules/core/utils/entity-form.svelte.js'
  import { type OrderInput, orderSchema } from '#modules/orders/data/schema.js'
  import type { Order } from '#modules/orders/data/types.js'
  import { SERVICE_LABEL } from '#modules/orders/utils/status.js'
  import OrderAside from './order-aside.svelte'
  import OrderPackages from './order-packages.svelte'

  let {
    initial,
    page,
    save,
  }: { initial: OrderInput; page: FormPageText; save: (values: OrderInput) => void } = $props()

  const form = entityForm(
    orderSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  let search = $state('')

  // Active clients, plus the order's own if it has since been paused.
  const clients = $derived(
    store.data.clients
      .filter((client) => client.status === 'active' || client.id === initial.clientId)
      .map((client) => ({ value: client.id, label: client.name })),
  )

  const matching = $derived(
    clients.filter((client) => client.label.toLowerCase().includes(search.trim().toLowerCase())),
  )

  const startingClient = untrack(
    () => clients.find((client) => client.value === initial.clientId)?.label,
  )

  const services = Object.entries(SERVICE_LABEL).map(([value, label]) => ({ value, label }))

  const origins = $derived(
    store.data.locations.map((location) => ({ value: location.id, label: location.name })),
  )
</script>

{#snippet body()}
  <form method="POST" id="order-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <FormSection
          icon={Users}
          title="Client and service"
          hint="Who it is for and how fast it goes."
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField {form} name="clientId">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Client</FormLabel>
                  <Combobox type="single" bind:value={$values.clientId} items={clients}>
                    <!-- bits-ui fills the field when an item is picked, not from a starting
                         value, so an existing order's client is put in by hand. -->
                    <ComboboxInput
                      {...props}
                      defaultValue={startingClient}
                      placeholder="Search clients…"
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
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="service">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel>Service</FormLabel>
                  <Select
                    type="single"
                    value={$values.service}
                    onValueChange={(next) => ($values.service = next as Order['service'])}
                    items={services}
                  >
                    <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {#each services as service (service.value)}
                        <SelectItem value={service.value} label={service.label} />
                      {/each}
                    </SelectContent>
                  </Select>
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </FormSection>

        <Separator />

        <FormSection
          icon={Route}
          title="Route"
          hint="Where it ships from and where it is delivered."
        >
          <div class="grid gap-4 sm:grid-cols-2">
            <FormField {form} name="originId">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Ships from</FormLabel>
                  <Select
                    type="single"
                    value={$values.originId}
                    onValueChange={(next) => ($values.originId = next)}
                    items={origins}
                  >
                    <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {#each origins as origin (origin.value)}
                        <SelectItem value={origin.value} label={origin.label} />
                      {/each}
                    </SelectContent>
                  </Select>
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
            <FormField {form} name="destination">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Delivery address</FormLabel>
                  <Input
                    {...props}
                    bind:value={$values.destination}
                    placeholder="Street and number"
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </FormSection>

        <Separator />

        <OrderPackages {form} />

        <Separator />

        <FormSection
          icon={Banknote}
          title="Billing"
          hint="What the client is charged for this order."
        >
          <div class="grid gap-4 sm:grid-cols-3">
            <FormField {form} name="total">
              <FormControl>
                {#snippet children({ props })}
                  <FormLabel required>Total</FormLabel>
                  <NumberInput
                    {...props}
                    format="currency"
                    prefix="$"
                    clearable={false}
                    bind:value={$values.total}
                  />
                {/snippet}
              </FormControl>
              <FormFieldErrors />
            </FormField>
          </div>
        </FormSection>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <OrderAside values={$values} />
{/snippet}

<FormPage {...page} formId="order-form" form={body} {aside} />
