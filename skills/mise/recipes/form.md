# Recipe: a form

A "new stock item" form, in two versions: [form.svelte](form.svelte) for Inertia or plain Svelte,
and [form-sveltekit.svelte](form-sveltekit.svelte) for SvelteKit through `mise/form`. Both
type-check against the current mise.

## What it is made of

- `Card` ([layout](../components/layout.md)) as the surface, `FieldGroup` for the spacing.
- `Field`, `FieldLabel`, `FieldDescription` and `FieldError` ([forms](../components/forms.md))
  around each control: `Input`, `Select`, `QuantityInput`, `NumberInput`.
- `SwitchField` for an on/off setting with a label and a description in one row.
- `Button` with a `Spinner` while the form submits.

## Inertia (form.svelte)

mise does not validate; the app does, and mise shows the result. The component takes the item,
the errors and the processing flag as props, so with Inertia it is driven by `useForm`:

```svelte
<script lang="ts">
  import { useForm } from '@inertiajs/svelte'
  import StockItemForm from './StockItemForm.svelte'

  const form = useForm({
    name: '',
    category: '',
    unit: 'kg',
    openingStock: null,
    unitCost: null,
    tracksExpiry: false,
  })
</script>

<StockItemForm
  bind:item={$form}
  errors={$form.errors}
  processing={$form.processing}
  onsubmit={() => $form.post('/stock-items')}
/>
```

Laravel's validation errors arrive keyed by field name; each `Field` sets `data-invalid` and its
control `aria-invalid` when its key is present, and `FieldError` shows the message.

## SvelteKit (form-sveltekit.svelte)

`Form`, `FormField`, `FormControl`, `FormLabel`, `FormDescription`, `FormFieldErrors` and
`FormButton` come from `@jovertical/mise-design-system/form`. superforms validates in the browser
with the same schema the server action uses. The page's server file:

```ts
// +page.server.ts
import { fail } from '@sveltejs/kit'
import { superValidate } from 'sveltekit-superforms'
import { zod4 } from 'sveltekit-superforms/adapters'
import { stockItemSchema } from './+page.svelte'

export const load = async () => ({ form: await superValidate(zod4(stockItemSchema)) })

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod4(stockItemSchema))
    if (!form.valid) return fail(400, { form })
    // save form.data
    return { form }
  },
}
```

In a real app, move `stockItemSchema` to its own module (`$lib/schemas/stock-item.ts`) and import
it from both files.

## Decisions worth copying

- **Money is integer cents.** `NumberInput format="currency"` shows `$12.50` and binds `1250`, so
  no price is ever a float.
- **An amount and its unit are one control.** `QuantityInput` makes "2.5" without "kg"
  impossible to submit.
- **`Select` gets `items`**, so its trigger shows the chosen label while the list is closed.
- **A required field says so** with `FieldLabel required`: an asterisk for the eye and
  "(required)" for a screen reader.
