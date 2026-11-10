<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import { defaults, superForm } from 'sveltekit-superforms'
  import { zod4 } from 'sveltekit-superforms/adapters'
  import { z } from 'zod'

  import Input from '../input/input.svelte'
  import Form from './form.svelte'
  import FormButton from './form-button.svelte'
  import FormDescription from './form-description.svelte'
  import FormField from './form-field.svelte'
  import FormFieldErrors from './form-field-errors.svelte'
  import FormLabel from './form-label.svelte'

  const { Story } = defineMeta({
    title: 'Forms/Form',
    component: Form,
    tags: ['shadcn'],
  })

  const schema = z.object({ name: z.string().min(2, 'A location name is required.') })
</script>

<script lang="ts">
  import { Control as FormControl } from 'formsnap'

  // A client-side form for the demo: SPA mode validates in the browser, and
  // there is no server action for applyAction to hand a result to.
  const form = superForm(defaults(zod4(schema)), {
    SPA: true,
    applyAction: false,
    validators: zod4(schema),
  })

  const { form: data } = form
</script>

<!--
  Wires superforms' validation into a field: the label points at the control,
  the description and the errors are linked to it, and `aria-invalid` follows
  the field. Press Save with the field empty to see the error.

  Import it from `mise/form`, and only in a SvelteKit app: superforms imports
  `$app/*`, which exists nowhere else. Reach for `Field` directly for a form
  with no superforms behind it.
-->
<Story name="Playground" asChild>
  <Form {form} class="flex max-w-sm flex-col gap-4">
    <FormField {form} name="name">
      <FormControl>
        {#snippet children({ props })}
          <FormLabel required>Location name</FormLabel>
          <Input {...props} bind:value={$data.name} placeholder="North depot" />
        {/snippet}
      </FormControl>
      <FormDescription>Shown on receipts and the register picker.</FormDescription>
      <FormFieldErrors />
    </FormField>
    <FormButton class="self-start">Save</FormButton>
  </Form>
</Story>
