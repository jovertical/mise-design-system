<!--
  The same "new stock item" form in a SvelteKit app, through `mise/form`:
  superforms validates on the client and in the form action, and the Form
  parts link each label, description and error to its control. This is a
  page component (+page.svelte); its load and action are in form.md.

  SvelteKit only: superforms imports `$app/*`. In an Inertia or plain Vite app
  use form.svelte instead.
-->
<script lang="ts" module>
  import { z } from 'zod'

  /** Shared with +page.server.ts, which validates the same schema on submit. */
  export const stockItemSchema = z.object({
    name: z.string().min(2, 'Name the item.'),
    category: z.enum(['dry', 'dairy', 'produce'], { message: 'Choose a category.' }),
    /** Integer cents. */
    unitCost: z.number().int().min(0).nullable(),
    tracksExpiry: z.boolean().default(false),
  })
</script>

<script lang="ts">
  import { Input, NumberInput, SwitchField } from '@jovertical/mise-design-system'
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
  import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'

  let { data }: { data: { form: SuperValidated<Infer<typeof stockItemSchema>> } } = $props()

  // Created once for the page; superforms keeps it in step with later loads.
  // `json` posts the bound values as they are, so the switch needs no input
  // name and the cents stay a number.
  const form = superForm(
    untrack(() => data.form),
    { validators: zod4(stockItemSchema), dataType: 'json' },
  )
  const { form: values } = form
</script>

<Form {form} method="POST" class="flex max-w-xl flex-col gap-6">
  <FormField {form} name="name">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>Name</FormLabel>
        <Input {...props} bind:value={$values.name} placeholder="All-purpose flour, 25 kg" />
      {/snippet}
    </FormControl>
    <FormFieldErrors />
  </FormField>

  <FormField {form} name="unitCost">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel>Unit cost</FormLabel>
        <NumberInput {...props} format="currency" prefix="$" bind:value={$values.unitCost} />
      {/snippet}
    </FormControl>
    <FormDescription>In dollars and cents; stored as cents.</FormDescription>
    <FormFieldErrors />
  </FormField>

  <SwitchField
    id="tracks-expiry"
    label="Track expiry dates"
    bind:checked={$values.tracksExpiry}
  />

  <FormButton class="self-start">Save item</FormButton>
</Form>
