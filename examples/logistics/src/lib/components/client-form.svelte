<!--
  The client form, for New client and Edit client: the company, who to talk
  to, and the account, with a summary and what is still missing beside it.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    CardTitle,
    Input,
    Separator,
    SwitchField,
    Text,
  } from '@jovertical/mise-design-system'
  import {
    FormControl,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import BadgeCheck from '@lucide/svelte/icons/badge-check'
  import Building from '@lucide/svelte/icons/building'
  import UserRound from '@lucide/svelte/icons/user-round'
  import { untrack } from 'svelte'

  import ClientAside from '#lib/components/client-aside.svelte'
  import FormPage, { type FormPageText } from '#lib/components/form-page.svelte'
  import { type ClientInput, clientSchema } from '#lib/data/clients/schema.js'
  import type { Cents } from '#lib/data/types.js'
  import { entityForm } from '#lib/entity-form.svelte.js'

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

{#snippet companyIcon()}
  <Building />
{/snippet}
{#snippet contactIcon()}
  <UserRound />
{/snippet}
{#snippet accountIcon()}
  <BadgeCheck />
{/snippet}

{#snippet heading(icon: typeof companyIcon, title: string, hint: string)}
  <div class="flex flex-col gap-1">
    <CardTitle {icon} iconTone="primary">{title}</CardTitle>
    <Text as="p" size="sm" muted>{hint}</Text>
  </div>
{/snippet}

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
        <section class="flex flex-col gap-4">
          {@render heading(companyIcon, 'Company', 'Who the client is and where they are.')}
          <div class="grid gap-4 sm:grid-cols-3">
            {@render textField('name', 'Name', 'Pine Street Deli')}
            {@render textField('industry', 'Industry', 'Food')}
            {@render textField('city', 'City', 'Riverside')}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(contactIcon, 'Contact', 'Who to talk to about their orders.')}
          <div class="grid gap-4 sm:grid-cols-2">
            {@render textField('contact', 'Contact name', 'H. Boyd')}
            {@render textField('email', 'Email', 'orders@pinestreet.example', 'email')}
          </div>
        </section>

        <Separator />

        <section class="flex flex-col gap-4">
          {@render heading(
            accountIcon,
            'Account',
            'Who looks after them, and whether they can order.',
          )}
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
        </section>
      </CardContent>
    </Card>
  </form>
{/snippet}

{#snippet aside()}
  <ClientAside values={$values} {worth} />
{/snippet}

<FormPage {...page} formId="client-form" form={body} {aside} />
