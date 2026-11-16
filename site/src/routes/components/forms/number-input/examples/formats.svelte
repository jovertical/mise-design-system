<!--
  `integer` takes whole numbers; `decimal` takes up to `precision` places;
  `currency` speaks cents: 1999 in, "19.99" shown, and only two places typed.
-->
<script lang="ts">
  import { NumberInput } from '@jovertical/mise-design-system'

  let units: number | null = $state(48)
  let weight: number | null = $state(0.125)
  let price: number | null = $state(1999)
</script>

<NumberInput class="w-36" aria-label="Units" format="integer" bind:value={units} />
<NumberInput class="w-36" aria-label="Weight in kg" precision={3} bind:value={weight} />
<NumberInput class="w-36" aria-label="Price" format="currency" prefix="$" bind:value={price} />
