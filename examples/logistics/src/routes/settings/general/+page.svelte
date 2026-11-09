<!--
  General settings, through mise/form: superforms validates in the browser
  (SPA mode; there is no server), and the Form parts link each label,
  description and error to its control. Saving writes to the demo store.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    PageHeader,
    PageLayout,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SwitchField,
    ToggleGroup,
    ToggleGroupItem,
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
  import { untrack } from 'svelte'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'

  import { settingsSchema, TIMEZONES } from '#lib/data/schemas.js'
  import { getSettings, saveSettings } from '#lib/data/settings.js'
  import { store } from '#lib/data/store.svelte.js'

  // Built once from the saved settings. SPA mode validates in the browser;
  // applyAction is off because there is no server action to hand results to;
  // json keeps the booleans and the units choice as they are.
  const form = superForm(
    defaults(
      untrack(() => ({ ...getSettings(store) })),
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
        toast.success('Settings saved')
      },
    },
  )
  const { form: values } = form

  const timezones = TIMEZONES.map((zone) => ({ value: zone, label: zone.replace('_', ' ') }))
</script>

<PageLayout>
  <PageHeader title="General settings" description="How the company appears and measures things." />

  <Card class="max-w-2xl">
    <CardHeader>
      <CardTitle>Company</CardTitle>
      <CardDescription>Shown on packing slips and in the sidebar.</CardDescription>
    </CardHeader>
    <CardContent>
      <Form {form} class="flex flex-col gap-6">
        <FormField {form} name="companyName">
          <FormControl>
            {#snippet children({ props })}
              <FormLabel required>Company name</FormLabel>
              <Input {...props} bind:value={$values.companyName} />
            {/snippet}
          </FormControl>
          <FormFieldErrors />
        </FormField>

        <FormField {form} name="timezone">
          <FormControl>
            {#snippet children({ props })}
              <FormLabel>Timezone</FormLabel>
              <Select type="single" bind:value={$values.timezone} items={timezones}>
                <SelectTrigger {...props} class="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {#each timezones as zone (zone.value)}
                    <SelectItem value={zone.value} label={zone.label} />
                  {/each}
                </SelectContent>
              </Select>
            {/snippet}
          </FormControl>
          <FormDescription>Dates and delivery windows are shown in this zone.</FormDescription>
          <FormFieldErrors />
        </FormField>

        <FormField {form} name="units">
          <FormControl>
            {#snippet children({ props })}
              <FormLabel>Units</FormLabel>
              <ToggleGroup
                {...props}
                type="single"
                variant="outline"
                bind:value={$values.units}
                class="self-start"
              >
                <ToggleGroupItem value="metric">Metric</ToggleGroupItem>
                <ToggleGroupItem value="imperial">Imperial</ToggleGroupItem>
              </ToggleGroup>
            {/snippet}
          </FormControl>
          <FormDescription>Weights in kilograms or pounds across the app.</FormDescription>
        </FormField>

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

        <FormButton class="self-start">Save changes</FormButton>
      </Form>
    </CardContent>
  </Card>
</PageLayout>
