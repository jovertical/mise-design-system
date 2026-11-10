<!--
  The order form, for New order and Edit order: who it is for, where it goes,
  what it carries and what it costs, with a summary and what is still missing
  beside it. One superForm from entityForm; mise/form draws the fields and
  their errors, the shared schema decides what is valid.
-->
<script lang="ts">
  import {
    Badge,
    Button,
    Card,
    CardContent,
    CardTitle,
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
    Text,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormFieldset,
    FormLabel,
    FormLegend,
  } from '@jovertical/mise-design-system/form'
  import Banknote from '@lucide/svelte/icons/banknote'
  import Package from '@lucide/svelte/icons/package'
  import Plus from '@lucide/svelte/icons/plus'
  import Route from '@lucide/svelte/icons/route'
  import Users from '@lucide/svelte/icons/users'
  import X from '@lucide/svelte/icons/x'
  import { untrack } from 'svelte'
  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import OrderAside from '#lib/components/order-aside.svelte'
  import { type OrderInput, orderSchema } from '#lib/data/schemas.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Order } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'
  import { SERVICE_LABEL } from '#lib/status.js'

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

  function addPackage() {
    $values.packages = [...$values.packages, { contents: '', weightKg: 0 }]
  }

  function removePackage(index: number) {
    $values.packages = $values.packages.toSpliced(index, 1)
  }
</script>

{#snippet usersIcon()}
  <Users />
{/snippet}
{#snippet routeIcon()}
  <Route />
{/snippet}
{#snippet packageIcon()}
  <Package />
{/snippet}
{#snippet billingIcon()}
  <Banknote />
{/snippet}

{#snippet heading(icon: typeof usersIcon, title: string, hint: string)}
  <div class="flex flex-col gap-1">
    <CardTitle {icon} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
{/snippet}

{#snippet body()}
  <form method="POST" id="order-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <section class="flex flex-col gap-4">
          {@render heading(usersIcon, 'Client and service', 'Who it is for and how fast it goes.')}
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
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(routeIcon, 'Route', 'Where it ships from and where it is delivered.')}
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
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            packageIcon,
            'Packages',
            'One row per package. Labels number themselves.',
          )}
          <FormFieldset {form} name="packages" class="flex flex-col gap-3">
            <FormLegend class="sr-only">Packages</FormLegend>
            {#each $values.packages as _, index (index)}
              <div class="grid grid-cols-[auto_1fr_9rem_auto] items-start gap-3">
                <Badge variant="outline" class="mt-2">PKG-{index + 1}</Badge>
                <FormField {form} name={`packages[${index}].contents` as const} class="space-y-0">
                  <FormControl>
                    {#snippet children({ props })}
                      <FormLabel class="sr-only">PKG-{index + 1} contents</FormLabel>
                      <Input
                        {...props}
                        bind:value={$values.packages[index].contents}
                        placeholder="What is in it"
                      />
                    {/snippet}
                  </FormControl>
                  <FormFieldErrors class="mt-1 empty:hidden" />
                </FormField>
                <FormField {form} name={`packages[${index}].weightKg` as const} class="space-y-0">
                  <FormControl>
                    {#snippet children({ props })}
                      <FormLabel class="sr-only">PKG-{index + 1} weight in kilograms</FormLabel>
                      <NumberInput
                        {...props}
                        bind:value={$values.packages[index].weightKg}
                        clearable={false}
                        prefix="kg"
                      />
                    {/snippet}
                  </FormControl>
                  <FormFieldErrors class="mt-1 empty:hidden" />
                </FormField>
                <Button
                  type="button"
                  variant="ghost"
                  iconOnly
                  aria-label="Remove PKG-{index + 1}"
                  disabled={$values.packages.length === 1}
                  onclick={() => removePackage(index)}
                >
                  <X />
                </Button>
              </div>
            {/each}
            <FormFieldErrors class="empty:hidden" />
            <div>
              <Button type="button" variant="ghost" size="sm" onclick={addPackage}>
                <Plus />
                Add package
              </Button>
            </div>
          </FormFieldset>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(billingIcon, 'Billing', 'What the client is charged for this order.')}
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
        </section>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <OrderAside values={$values} />
{/snippet}

<FormPage {...page} formId="order-form" form={body} {aside} />
