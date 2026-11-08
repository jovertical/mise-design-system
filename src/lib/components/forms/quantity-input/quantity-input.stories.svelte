<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Field from '../field/field.svelte'
  import FieldDescription from '../field/field-description.svelte'
  import FieldLabel from '../field/field-label.svelte'
  import QuantityInput, { type QuantityUnit } from './quantity-input.svelte'

  const UNITS: QuantityUnit[] = [
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml' },
    { value: 'l', label: 'Liter (l)', short: 'l' },
    { value: 'g', label: 'Gram (g)', short: 'g' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg' },
    { value: 'fl_oz', label: 'Fluid Ounce (fl oz)', short: 'fl oz' },
    { value: 'piece', label: 'Piece', short: 'piece' },
    { value: 'batch', label: 'Batch', short: 'batch' },
  ]

  const GROUPED_UNITS: QuantityUnit[] = [
    { value: 'g', label: 'Gram (g)', short: 'g', group: 'Mass' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg', group: 'Mass' },
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml', group: 'Volume' },
    { value: 'l', label: 'Liter (l)', short: 'l', group: 'Volume' },
    { value: 'tbsp', label: 'Tablespoon (tbsp)', short: 'tbsp', group: 'Volume' },
  ]

  /*
    The units arrive as a prop, which is the whole reason this can live in the
    package: a measurement enum is domain, and shipping one here would ship an
    application's contract.
  */
  const { Story } = defineMeta({
    title: 'Forms/QuantityInput',
    component: QuantityInput,
    tags: ['mise'],
    parameters: { layout: 'centered' },
    args: { units: UNITS, unit: 'g', quantity: 1250 },
    argTypes: {
      layout: { control: 'inline-radio', options: ['unit-first', 'quantity-first'] },
    },
  })

  const quantityFirst = $state({ unit: 'ml', quantity: 1250 as number | null })
  const field = $state({ unit: 'piece', quantity: 24 as number | null })
  const grouped = $state({ unit: 'g', quantity: 30 as number | null })
  const footer = $state({ unit: 'tbsp', quantity: 2 as number | null })
</script>

{#snippet densityFooter(closeMenu: () => void)}
  <span>Density 0.92 g per ml</span>
  <button type="button" class="text-primary font-medium" onclick={closeMenu}>Edit</button>
{/snippet}

<!--
  The default. The unit leads and takes two thirds of the field: for a stock
  movement, where the unit governs what the number means and is chosen once
  for a line that is then counted into. The full label fits at this width.
-->
<Story name="Playground">
  {#snippet template(args)}
    <div class="w-72"><QuantityInput {...args} /></div>
  {/snippet}
</Story>

<!--
  `menuFooter` puts a fact and an action below the units: here the item's
  density, which is what lets the other group convert, with a way to change it.
  The snippet is handed `closeMenu` so the action can clear the menu before
  opening anything of its own.
-->
<Story name="With menu footer" asChild>
  <div class="w-72">
    <QuantityInput
      units={GROUPED_UNITS}
      groupHints={{ Mass: '0.92 g per ml' }}
      menuFooter={densityFooter}
      layout="quantity-first"
      bind:unit={footer.unit}
      bind:quantity={footer.quantity}
    />
  </div>
</Story>

<!--
  In a `Field`, which is where either layout actually appears. The control is
  one field, not two, so it takes one label and one description.
-->
<Story name="In a field" asChild>
  <div class="w-72">
    <Field>
      <FieldLabel>Makes</FieldLabel>
      <QuantityInput
        units={UNITS}
        layout="quantity-first"
        bind:unit={field.unit}
        bind:quantity={field.quantity}
      />
      <FieldDescription>One batch of this recipe.</FieldDescription>
    </Field>
  </div>
</Story>

<!--
  `layout="quantity-first"` puts the amount first and the unit in a narrow
  trailing slot, for anywhere the amount is what gets revised: a recipe line,
  a conversion. The trigger drops to the short form, because at 6rem
  "Milliliter (ml)" truncates to nonsense; the open menu keeps the full label.
-->
<Story name="Quantity first" asChild>
  <div class="w-72">
    <QuantityInput
      units={UNITS}
      layout="quantity-first"
      bind:unit={quantityFirst.unit}
      bind:quantity={quantityFirst.quantity}
    />
  </div>
</Story>

<!--
  Units listed under a heading per `group`, with a hint beside one heading:
  oil weighed by the gram, poured by the tablespoon once its density is set.
  The hinted units stay pickable; what picking one does is the caller's call.
-->
<Story name="Grouped" asChild>
  <div class="w-72">
    <QuantityInput
      units={GROUPED_UNITS}
      groupHints={{ Volume: 'needs density' }}
      layout="quantity-first"
      bind:unit={grouped.unit}
      bind:quantity={grouped.quantity}
    />
  </div>
</Story>
