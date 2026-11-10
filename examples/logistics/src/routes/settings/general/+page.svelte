<!--
  General settings, laid out as the client portal lays its own: Cancel and
  Save in the page header, the company in a wide card beside its branding,
  and the regional, measurement and numbering defaults in a row below. One
  mise/form form; superforms validates in the browser (SPA mode, no server)
  and Save stays disabled until something changes.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    type MediaAsset,
    MediaDropzone,
    type MediaUploaderAdapter,
    PageHeader,
    PageLayout,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SwitchField,
    Text,
    toast,
  } from '@jovertical/mise-design-system'
  import {
    Form,
    FormButton,
    FormControl,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import Bell from '@lucide/svelte/icons/bell'
  import Building from '@lucide/svelte/icons/building'
  import Globe from '@lucide/svelte/icons/globe'
  import Hash from '@lucide/svelte/icons/hash'
  import ImageIcon from '@lucide/svelte/icons/image'
  import Ruler from '@lucide/svelte/icons/ruler'
  import { untrack } from 'svelte'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'

  import { initials } from '#lib/data/lookups.js'
  import { settingsSchema, TIMEZONES } from '#lib/data/schemas.js'
  import { getSettings, saveSettings } from '#lib/data/settings.js'
  import { store } from '#lib/data/store.svelte.js'
  import type { Settings } from '#lib/data/types.js'

  // Built once from the saved settings. SPA mode validates in the browser;
  // applyAction is off because there is no server action to hand results to;
  // json keeps the booleans and the nested address as they are.
  const form = superForm(
    defaults(
      untrack(() => structuredClone($state.snapshot(getSettings(store)))),
      zod4(settingsSchema),
    ),
    {
      SPA: true,
      applyAction: false,
      dataType: 'json',
      resetForm: false,
      validators: zod4(settingsSchema),
      onUpdate({ form: result }) {
        if (!result.valid) return

        saveSettings(store, result.data)

        // The saved settings are the new baseline: Cancel goes back to them.
        form.reset({ newState: result.data })

        toast.success('Settings saved')
      },
    },
  )

  const { form: values, tainted, isTainted } = form
  const changed = $derived(isTainted($tainted))

  type TextKey = 'companyName' | 'legalName' | 'taxId' | 'supportEmail' | 'phone' | 'website'
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

  // The demo has no media service, so an upload is read into a data URL, with
  // the reader's progress so the zone's states show.
  const adapter: MediaUploaderAdapter = {
    ready: true,
    upload(file, { onProgress, signal }) {
      return new Promise((done, fail) => {
        const reader = new FileReader()

        reader.onprogress = (event) => {
          if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
        }

        reader.onerror = () => fail(reader.error ?? new Error('Could not read the file'))

        reader.onload = () =>
          done({
            uuid: crypto.randomUUID(),
            url: String(reader.result),
            name: file.name,
            mimeType: file.type,
            size: file.size,
          })

        signal.addEventListener('abort', () => reader.abort())

        reader.readAsDataURL(file)
      })
    },
  }

  const logo = $derived<MediaAsset | null>(
    $values.logo ? { uuid: 'logo', url: $values.logo, name: 'Logo' } : null,
  )

  // Each preview shows the number the next document of its kind would get.
  const highest = (numbers: string[]) =>
    Math.max(0, ...numbers.map((n) => Number(n.replace(/\D/g, ''))))

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

{#snippet textField(name: TextKey, label: string, required = false, placeholder = '')}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel {required}>{label}</FormLabel>
        <Input {...props} bind:value={$values[name]} {placeholder} />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
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

{#snippet addressField(
  key: keyof Settings['address'],
  label: string,
  required = false,
  placeholder = '',
)}
  <FormField {form} name="address.{key}">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel {required}>{label}</FormLabel>
        <Input {...props} bind:value={$values.address[key]} {placeholder} />
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

{#snippet building()}
  <Building />
{/snippet}
{#snippet image()}
  <ImageIcon />
{/snippet}
{#snippet globe()}
  <Globe />
{/snippet}
{#snippet ruler()}
  <Ruler />
{/snippet}
{#snippet hash()}
  <Hash />
{/snippet}
{#snippet bell()}
  <Bell />
{/snippet}

{#snippet actions()}
  <Button type="button" variant="outline" disabled={!changed} onclick={() => form.reset()}>
    Cancel
  </Button>
  <FormButton disabled={!changed}>Save changes</FormButton>
{/snippet}

<Form {form}>
  <PageLayout>
    <PageHeader
      title="General settings"
      description="Company profile, regional preferences and operational defaults."
      {actions}
    />

    <div class="grid gap-4 lg:grid-cols-3">
      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle icon={building} iconTone="neutral">Company information</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-6">
          <div class="grid gap-4 sm:grid-cols-2">
            {@render textField('companyName', 'Display name', true)}
            {@render textField('legalName', 'Registered name', true)}
            {@render textField('taxId', 'Tax ID', true)}
            {@render textField('phone', 'Phone number')}
            {@render textField('supportEmail', 'Support email', true)}
            {@render textField('website', 'Website', false, 'https://')}
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-0.5">
              <Text weight="medium">Registered address</Text>
              <Text size="sm" muted>Printed on packing slips, invoices and delivery notes.</Text>
            </div>
            {@render addressField('line1', 'Address line 1', true)}
            {@render addressField('line2', 'Address line 2', false, 'Unit, floor, building')}
            <div class="grid gap-4 sm:grid-cols-3">
              {@render addressField('city', 'City', true)}
              {@render addressField('region', 'State or region')}
              {@render addressField('postalCode', 'Postal code')}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle icon={image} iconTone="neutral">Branding</CardTitle></CardHeader>
        <CardContent class="flex flex-col gap-4">
          <MediaDropzone
            {adapter}
            value={logo}
            onValueChange={(asset) => ($values.logo = asset?.url ?? null)}
            placeholder="Drag and drop your logo here"
            hint="PNG, JPG or SVG, up to 2 MB"
            recommendation="512 × 512 px works best"
          />
          <div class="flex flex-col gap-2">
            <Text size="sm" weight="medium">Brand mark preview</Text>
            <div class="grid place-items-center rounded-xl border py-8">
              {#if $values.logo}
                <img src={$values.logo} alt="Logo" class="size-24 rounded-2xl object-contain">
              {:else}
                <span
                  class="bg-primary text-primary-foreground grid size-24 place-items-center rounded-2xl text-3xl font-semibold"
                >
                  {initials($values.companyName || '?')}
                </span>
              {/if}
            </div>
            <Text size="sm" muted>How the brand appears on documents and emails.</Text>
          </div>
        </CardContent>
      </Card>
    </div>

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

    <Card>
      <CardHeader>
        <CardTitle icon={bell} iconTone="neutral">Delivery</CardTitle>
        <CardDescription>What happens around each drop.</CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4 md:grid-cols-2">
        <SwitchField
          id="delivery-confirmations"
          label="Send delivery confirmations"
          description="Email the client when the last stop of a shipment is delivered."
          bind:checked={$values.deliveryConfirmations}
        />
        <SwitchField
          id="proof-of-delivery"
          label="Require proof of delivery"
          description="Drivers must take a photo or signature at every stop."
          bind:checked={$values.proofOfDelivery}
        />
      </CardContent>
    </Card>
  </PageLayout>
</Form>
