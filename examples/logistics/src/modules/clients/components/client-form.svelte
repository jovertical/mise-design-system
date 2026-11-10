<!--
  The client form, for New client and Edit client: the company, who to talk
  to, and the account, with a summary and what is still missing beside it.
-->
<script lang="ts">
  import { Card, CardContent, Input, Separator, SwitchField } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import IconBuilding from '@tabler/icons-svelte-runes/icons/building'
  import IconRosetteDiscountCheck from '@tabler/icons-svelte-runes/icons/rosette-discount-check'
  import IconUser from '@tabler/icons-svelte-runes/icons/user'
  import { untrack } from 'svelte'
  import { type ClientInput, clientSchema } from '#modules/clients/data/schema.js'
  import FormPage, { type FormPageText } from '#modules/core/components/form-page.svelte'
  import FormSection from '#modules/core/components/form-section.svelte'
  import type { Cents } from '#modules/core/data/types.js'
  import { entityForm } from '#modules/core/utils/entity-form.svelte.js'
  import ClientAside from './client-aside.svelte'

  let {
    initial,
    page,
    save,
    worth = null,
  }: {
    initial: ClientInput
    page: FormPageText
    save: (values: ClientInput) => void
    worth?: { lifetime: Cents; open: Cents } | null
  } = $props()

  const form = entityForm(
    clientSchema,
    untrack(() => initial),
    (values) => save(values),
  )

  const { form: values, enhance } = form

  type TextKey = 'name' | 'industry' | 'city' | 'contact' | 'email' | 'manager'
</script>

{#snippet textField(name: TextKey, label: string, placeholder: string, type = 'text')}
  <FormField {form} {name}>
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>{label}</FormLabel>
        <Input {...props} {type} {placeholder} bind:value={$values[name]} />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>
{/snippet}

{#snippet body()}
  <form method="POST" id="client-form" use:enhance>
    <Card>
      <CardContent class="flex flex-col gap-6">
        <FormSection
          icon={IconBuilding}
          title="Company"
          hint="Who the client is and where they are."
        >
          <div class="grid gap-4 sm:grid-cols-3">
            {@render textField('name', 'Name', 'Pine Street Deli')}
            {@render textField('industry', 'Industry', 'Food')}
            {@render textField('city', 'City', 'Riverside')}
          </div>
        </FormSection>

        <Separator />

        <FormSection icon={IconUser} title="Contact" hint="Who to talk to about their orders.">
          <div class="grid gap-4 sm:grid-cols-2">
            {@render textField('contact', 'Contact name', 'H. Boyd')}
            {@render textField('email', 'Email', 'orders@pinestreet.example', 'email')}
          </div>
        </FormSection>

        <Separator />

        <FormSection
          icon={IconRosetteDiscountCheck}
          title="Account"
          hint="Who looks after them, and whether they can order."
        >
          <div class="grid gap-4 sm:grid-cols-2">
            {@render textField('manager', 'Account manager', 'Ops manager')}
          </div>
          <SwitchField
            id="client-active"
            label="Active"
            description="Paused clients can't be chosen for new orders."
            checked={$values.status === 'active'}
            onCheckedChange={(active) => ($values.status = active ? 'active' : 'paused')}
          />
        </FormSection>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <ClientAside values={$values} {worth} />
{/snippet}

<FormPage {...page} formId="client-form" form={body} {aside} />
