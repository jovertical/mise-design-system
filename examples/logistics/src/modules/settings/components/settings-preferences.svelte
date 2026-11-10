<!--
  General settings' row of preferences: regional, units and measurement, and
  document numbering, each prefix showing the number the next document gets.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Text,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import IconHash from '@tabler/icons-svelte-runes/icons/hash'
  import IconRuler from '@tabler/icons-svelte-runes/icons/ruler'
  import IconWorld from '@tabler/icons-svelte-runes/icons/world'
  import type { SuperForm } from 'sveltekit-superforms'
  import { store } from '#modules/core/data/store.svelte.js'
  import { TIMEZONES } from '#modules/settings/data/schema.js'
  import type { Settings } from '#modules/settings/data/types.js'

  let { form }: { form: SuperForm<Settings> } = $props()

  // The page builds the form once and never replaces it, so reading it here is enough.
  // svelte-ignore state_referenced_locally
  const { form: values } = form

  type Option = { value: string; label: string }

  const OPTIONS = {
    timezone: TIMEZONES.map((zone) => ({ value: zone, label: zone.replace('_', ' ') })),
    language: [
      { value: 'en-US', label: 'English (US)' },
      { value: 'en-GB', label: 'English (UK)' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
    ],
    currency: [
      { value: 'USD', label: 'USD, US dollar' },
      { value: 'EUR', label: 'EUR, euro' },
      { value: 'GBP', label: 'GBP, pound sterling' },
      { value: 'CAD', label: 'CAD, Canadian dollar' },
    ],
    dateFormat: [
      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    ],
    timeFormat: [
      { value: '12h', label: '12-hour (2:30 PM)' },
      { value: '24h', label: '24-hour (14:30)' },
    ],
    units: [
      { value: 'metric', label: 'Kilogram (kg)' },
      { value: 'imperial', label: 'Pound (lb)' },
    ],
    dimensionUnit: [
      { value: 'cm', label: 'Centimetre (cm)' },
      { value: 'in', label: 'Inch (in)' },
    ],
  } satisfies Record<string, Option[]>

  type SelectKey = keyof typeof OPTIONS

  // Each preview shows the number the next document of its kind would get.
  const highest = (numbers: string[]) =>
    Math.max(0, ...numbers.map((number) => Number(number.replace(/\D/g, ''))))

  const NEXT = $derived({
    orderPrefix: highest(store.data.orders.map((order) => order.number)) + 1,
    shipmentPrefix: highest(store.data.shipments.map((shipment) => shipment.number)) + 1,
    invoicePrefix: 1,
  })

  const nextNumber = (name: 'orderPrefix' | 'shipmentPrefix' | 'invoicePrefix') =>
    `${$values[name] || '—'}${String(NEXT[name]).padStart(4, '0')}`

  function setSelect(name: SelectKey, next: string) {
    ;($values as Record<string, unknown>)[name] = next
  }
</script>

{#snippet globe()}
  <IconWorld />
{/snippet}
{#snippet ruler()}
  <IconRuler />
{/snippet}
{#snippet hash()}
  <IconHash />
{/snippet}

{#snippet selectField(name: SelectKey, label: string)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>{label}</FormLabel>
        <Select
          type="single"
          value={$values[name]}
          onValueChange={(next) => setSelect(name, next)}
          items={OPTIONS[name]}
        >
          <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {#each OPTIONS[name] as option (option.value)}
              <SelectItem value={option.value} label={option.label} />
            {/each}
          </SelectContent>
        </Select>
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
{/snippet}

{#snippet prefixField(name: 'orderPrefix' | 'shipmentPrefix' | 'invoicePrefix', label: string)}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel>{label}</FormLabel>
        <Input {...props} bind:value={$values[name]} class="uppercase" />
      {/snippet}
    </FormControl>
    <FormDescription>Next: {nextNumber(name)}</FormDescription>
    <FormFieldErrors />
  </FormField>
{/snippet}

<div class="grid gap-4 lg:grid-cols-3">
  <Card>
    <CardHeader>
      <CardTitle icon={globe} iconTone="neutral">Regional preferences</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      {@render selectField('timezone', 'Time zone')}
      {@render selectField('language', 'Language')}
      {@render selectField('currency', 'Currency')}
      {@render selectField('dateFormat', 'Date format')}
      {@render selectField('timeFormat', 'Time format')}
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle icon={ruler} iconTone="neutral">Units and measurement</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      {@render selectField('units', 'Weight unit')}
      {@render selectField('dimensionUnit', 'Dimension unit')}
      <Text size="sm" muted>Used across the app for package weights and sizes.</Text>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle icon={hash} iconTone="neutral">Document numbering</CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      {@render prefixField('orderPrefix', 'Order prefix')}
      {@render prefixField('shipmentPrefix', 'Shipment prefix')}
      {@render prefixField('invoicePrefix', 'Invoice prefix')}
    </CardContent>
  </Card>
</div>
