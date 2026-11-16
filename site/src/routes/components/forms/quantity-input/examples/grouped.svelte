<!--
  Units under a heading per `group`, with a hint beside one heading, and a
  `menuFooter` with a fact and an action below the list. The footer gets
  `closeMenu`, so its action can clear the menu first.
-->
<script lang="ts">
  import { QuantityInput, type QuantityUnit } from '@jovertical/mise-design-system'

  const UNITS: QuantityUnit[] = [
    { value: 'g', label: 'Gram (g)', short: 'g', group: 'Mass' },
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg', group: 'Mass' },
    { value: 'ml', label: 'Milliliter (ml)', short: 'ml', group: 'Volume' },
    { value: 'tbsp', label: 'Tablespoon (tbsp)', short: 'tbsp', group: 'Volume' },
  ]

  let unit = $state('tbsp')
  let quantity: number | null = $state(2)
</script>

{#snippet densityFooter(closeMenu: () => void)}
  <span>Density 0.92 g per ml</span>
  <button type="button" class="text-primary font-medium" onclick={closeMenu}>Edit</button>
{/snippet}

<div class="w-72">
  <QuantityInput
    units={UNITS}
    groupHints={{ Mass: '0.92 g per ml' }}
    menuFooter={densityFooter}
    layout="quantity-first"
    bind:unit
    bind:quantity
    aria-label="Oil"
  />
</div>
