<!--
  superforms' validation wired into a field: the label points at the control,
  the description and errors are linked to it, and aria-invalid follows the
  field. Press Save with the field empty to see the error. SPA mode validates
  in the browser; a SvelteKit app usually validates in its form action.
-->
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

  const form = superForm(defaults(zod4(schema)), {
    SPA: true,
    applyAction: false,
    validators: zod4(schema),
  })

  const { form: data } = form
</script>

<Form {form} class="flex w-full max-w-sm flex-col gap-4">
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
