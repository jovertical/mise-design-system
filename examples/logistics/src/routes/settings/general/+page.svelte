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
    PageHeader,
    PageLayout,
    SwitchField,
    Text,
    toast,
  } from '@jovertical/mise-design-system'
  import {
    Form,
    FormButton,
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import Bell from '@lucide/svelte/icons/bell'
  import Building from '@lucide/svelte/icons/building'
  import { untrack } from 'svelte'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'
  import { store } from '#modules/core/data/store.svelte.js'
  import SettingsBranding from '#modules/settings/components/settings-branding.svelte'
  import SettingsPreferences from '#modules/settings/components/settings-preferences.svelte'
  import { getSettings, saveSettings } from '#modules/settings/data/index.js'
  import { settingsSchema } from '#modules/settings/data/schema.js'
  import type { Settings } from '#modules/settings/data/types.js'

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

{#snippet building()}
  <Building />
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

      <SettingsBranding {form} />
    </div>

    <SettingsPreferences {form} />

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
