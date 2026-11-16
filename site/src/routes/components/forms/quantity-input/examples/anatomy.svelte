<script lang="ts">
  import { QuantityInput, type QuantityUnit } from '@jovertical/mise-design-system'

  const UNITS: QuantityUnit[] = [
    { value: 'kg', label: 'Kilogram (kg)', short: 'kg' },
    { value: 'g', label: 'Gram (g)', short: 'g' },
  ]
</script>

<div class="w-72">
  <QuantityInput units={UNITS} unit="kg" quantity={25} aria-label="Received" />
</div>
