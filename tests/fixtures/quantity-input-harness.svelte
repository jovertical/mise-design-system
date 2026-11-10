<script lang="ts">
  import {
    QuantityInput,
    type QuantityInputLayout,
    type QuantityUnit,
  } from '../../src/lib/index.js'

  const FLAT: QuantityUnit[] = [
    { value: 'g', label: 'Gram (g)', short: 'g' },
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml' },
    { value: 'piece', label: 'Piece' },
  ]

  const GROUPED: QuantityUnit[] = [
    { value: 'g', label: 'Gram (g)', short: 'g', group: 'Mass' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg', group: 'Mass' },
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml', group: 'Volume' },
  ]

  let {
    unit = $bindable('g'),
    quantity = $bindable(1250),
    layout,
    grouped = false,
    footer = false,
  }: {
    unit?: string
    quantity?: number | null
    layout?: QuantityInputLayout
    grouped?: boolean
    footer?: boolean
  } = $props()

  let blurs = $state(0)
</script>

{#snippet menuFooter(closeMenu: () => void)}
  <span>Density 0.92 g per ml</span>
  <button type="button" onclick={closeMenu}>Edit density</button>
{/snippet}

<QuantityInput
  units={grouped ? GROUPED : FLAT}
  groupHints={{ Volume: 'needs density' }}
  {layout}
  bind:unit
  bind:quantity
  onQuantityBlur={() => blurs++}
  menuFooter={footer ? menuFooter : undefined}
/>
<button type="button">Elsewhere</button>
<output data-testid="state">{unit}:{quantity === null ? 'null' : quantity}:{blurs}</output>
