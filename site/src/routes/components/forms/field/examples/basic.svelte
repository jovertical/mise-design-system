<!--
  One field, in the order every field is written: label, control, description,
  error. `for` matches the control's `id`, always; without it the label is
  decoration.
-->
<script lang="ts">
  import { Field, FieldDescription, FieldLabel, Input } from '@jovertical/mise-design-system'
</script>

<Field class="w-full max-w-sm">
  <FieldLabel for="brand">Brand</FieldLabel>
  <Input id="brand" placeholder="North Mill" />
  <FieldDescription>Shown on the item page and searchable at the register.</FieldDescription>
</Field>
