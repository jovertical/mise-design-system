<!--
  A number typed into a text field. `null` is an empty field, not zero: blank
  means "not recorded", where zero would claim the item weighs nothing.
-->
<script lang="ts">
  import { Field, FieldDescription, FieldLabel, NumberInput } from '@jovertical/mise-design-system'

  let reorderPoint: number | null = $state(12)
</script>

<Field class="w-full max-w-xs">
  <FieldLabel for="reorder-point">Reorder point</FieldLabel>
  <NumberInput id="reorder-point" format="integer" controls bind:value={reorderPoint} />
  <FieldDescription>Warn when stock falls to this many units.</FieldDescription>
</Field>
