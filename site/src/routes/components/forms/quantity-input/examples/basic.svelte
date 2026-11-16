<!--
  The default layout: the unit leads and takes two thirds of the field, for a
  stock movement, where the unit governs what the number means. The units
  arrive as a prop: a measurement list is the app's, not mise's.
-->
<script lang="ts">
  import { QuantityInput, type QuantityUnit } from '@jovertical/mise-design-system'

  const UNITS: QuantityUnit[] = [
    { value: 'g', label: 'Gram (g)', short: 'g' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg' },
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml' },
    { value: 'l', label: 'Liter (l)', short: 'l' },
    { value: 'piece', label: 'Piece', short: 'piece' },
  ]

  let unit = $state('kg')
  let quantity: number | null = $state(25)
</script>

<div class="w-72">
  <QuantityInput units={UNITS} bind:unit bind:quantity aria-label="Received" />
</div>
