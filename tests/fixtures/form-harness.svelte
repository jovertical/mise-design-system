<script lang="ts">
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'
  import { z } from 'zod'

  import {
    Form,
    FormButton,
    FormControl,
    FormDescription,
    FormField,
    FormFieldErrors,
    FormLabel,
  } from '../../src/lib/form.js'
  import { Input } from '../../src/lib/index.js'

  const schema = z.object({ name: z.string().min(2, 'A location name is required.') })

  // applyAction hands a result to SvelteKit's running client, which a test does
  // not have; an SPA form has no server action to apply anyway.
  const form = superForm(defaults(zod4(schema)), {
    SPA: true,
    applyAction: false,
    validators: zod4(schema),
  })
  const { form: data } = form
</script>

<Form {form}>
  <FormField {form} name="name">
    <FormControl>
      {#snippet children({ props })}
        <FormLabel required>Location name</FormLabel>
        <Input {...props} bind:value={$data.name} />
      {/snippet}
    </FormControl>
    <FormDescription>Shown on receipts and the register picker.</FormDescription>
    <FormFieldErrors />
  </FormField>
  <FormButton>Save</FormButton>
</Form>
