<!--
  `layout="quantity-first"` puts the amount first and the unit in a narrow
  trailing slot, for anywhere the amount is what gets revised: a recipe line.
  In a Field it takes one label, since it is one control.
-->
<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldLabel,
    QuantityInput,
    type QuantityUnit,
  } from '@jovertical/mise-design-system'

  const UNITS: QuantityUnit[] = [
    { value: 'piece', label: 'Piece', short: 'piece' },
    { value: 'batch', label: 'Batch', short: 'batch' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg' },
  ]

  let unit = $state('piece')
  let quantity: number | null = $state(24)
</script>

<div class="w-72">
  <Field>
    <FieldLabel>Makes</FieldLabel>
    <QuantityInput units={UNITS} layout="quantity-first" bind:unit bind:quantity />
    <FieldDescription>One batch of this recipe.</FieldDescription>
  </Field>
</div>
