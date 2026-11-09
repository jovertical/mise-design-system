<!--
  A "new stock item" form for an Inertia or plain Svelte app. The form state
  is the app's: with Inertia it is `useForm`, and `errors` and `processing`
  come from it (see form.md). mise draws the fields, the labels, the errors
  and the invalid state; it does not validate.
-->
<script lang="ts">
  import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
    NumberInput,
    QuantityInput,
    type QuantityUnit,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Spinner,
    SwitchField,
  } from '@jovertical/mise-design-system'

  type StockItem = {
    name: string
    category: string
    unit: string
    openingStock: number | null
    /** Integer cents: NumberInput's currency format speaks minor units. */
    unitCost: number | null
    tracksExpiry: boolean
  }

  let {
    item = $bindable({
      name: '',
      category: '',
      unit: 'kg',
      openingStock: null,
      unitCost: null,
      tracksExpiry: false,
    }),
    errors = {},
    processing = false,
    onsubmit,
  }: {
    item?: StockItem
    /** Field name to message, as Laravel's validation returns them. */
    errors?: Partial<Record<keyof StockItem, string>>
    processing?: boolean
    onsubmit: () => void
  } = $props()

  const categories = [
    { value: 'dry', label: 'Dry goods' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'produce', label: 'Produce' },
  ]

  const units: QuantityUnit[] = [
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg', group: 'Mass' },
    { value: 'g', label: 'Gram (g)', short: 'g', group: 'Mass' },
    { value: 'l', label: 'Litre (l)', short: 'l', group: 'Volume' },
    { value: 'pc', label: 'Piece', short: 'pc', group: 'Count' },
  ]

  const errorFor = (field: keyof StockItem) => (errors[field] ? [{ message: errors[field] }] : [])

  function submit(event: SubmitEvent) {
    event.preventDefault()
    onsubmit()
  }
</script>

<form onsubmit={submit}>
  <Card class="max-w-xl">
    <CardHeader>
      <CardTitle>New stock item</CardTitle>
    </CardHeader>

    <CardContent>
      <FieldGroup>
        <Field data-invalid={errors.name ? 'true' : undefined}>
          <FieldLabel for="item-name" required>Name</FieldLabel>
          <Input
            id="item-name"
            bind:value={item.name}
            placeholder="All-purpose flour, 25 kg"
            aria-invalid={errors.name ? 'true' : undefined}
          />
          <FieldError errors={errorFor('name')} />
        </Field>

        <Field data-invalid={errors.category ? 'true' : undefined}>
          <FieldLabel for="item-category" required>Category</FieldLabel>
          <Select type="single" bind:value={item.category} items={categories}>
            <SelectTrigger id="item-category" aria-invalid={errors.category ? 'true' : undefined}>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {#each categories as category (category.value)}
                <SelectItem value={category.value} label={category.label} />
              {/each}
            </SelectContent>
          </Select>
          <FieldError errors={errorFor('category')} />
        </Field>

        <Field data-invalid={errors.openingStock ? 'true' : undefined}>
          <FieldLabel>Opening stock</FieldLabel>
          <QuantityInput
            {units}
            bind:unit={item.unit}
            bind:quantity={item.openingStock}
            quantityPlaceholder="0"
          />
          <FieldDescription>What is on the shelf today, counted.</FieldDescription>
          <FieldError errors={errorFor('openingStock')} />
        </Field>

        <Field data-invalid={errors.unitCost ? 'true' : undefined}>
          <FieldLabel for="item-cost">Unit cost</FieldLabel>
          <NumberInput
            id="item-cost"
            format="currency"
            prefix="$"
            bind:value={item.unitCost}
            aria-invalid={errors.unitCost ? 'true' : undefined}
          />
          <FieldError errors={errorFor('unitCost')} />
        </Field>

        <SwitchField
          id="item-expiry"
          label="Track expiry dates"
          description="Ask for a use-by date when this item is received."
          bind:checked={item.tracksExpiry}
        />
      </FieldGroup>
    </CardContent>

    <CardFooter class="justify-end">
      <Button type="submit" disabled={processing}>
        {#if processing}<Spinner />{/if}
        Save item
      </Button>
    </CardFooter>
  </Card>
</form>
