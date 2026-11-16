<!-- The form, its field showing an error, for the anatomy. -->
<script lang="ts">
  import { Input } from '@jovertical/mise-design-system'
  import {
    Form,
    FormButton,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '@jovertical/mise-design-system/form'
  import { Control } from 'formsnap'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'
  import { z } from 'zod'

  const schema = z.object({ name: z.string().min(2, 'A location name is required.') })

  const form = superForm(defaults({ name: 'N' }, zod4(schema)), {
    SPA: true,
    applyAction: false,
    // The anatomy validates on load; focusing the error would scroll the page to it.
    autoFocusOnError: false,
    validators: zod4(schema),
  })

  const { form: data } = form

  // Validate once on mount, so the error is there to point at.
  $effect(() => {
    form.validateForm({ update: true })
  })
</script>

<Form {form} class="flex w-80 flex-col gap-4">
  <FormField {form} name="name">
    <Control>
      {#snippet children({ props })}
        <FormLabel required>Location name</FormLabel>
        <Input {...props} bind:value={$data.name} placeholder="North depot" />
      {/snippet}
    </Control>
    <FormDescription>Shown on receipts and the register picker.</FormDescription>
    <FormFieldErrors />
  </FormField>
  <FormButton class="self-start">Save</FormButton>
</Form>
