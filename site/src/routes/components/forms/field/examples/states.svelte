<!--
  `required` rather than a hand-typed asterisk: the glyph is aria-hidden with
  a real "(required)" for a screen reader. An error is added under the
  description, not in its place: a reader correcting a mistake needs both.
-->
<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
  } from '@jovertical/mise-design-system'
</script>

<FieldGroup class="max-w-sm">
  <Field>
    <FieldLabel for="item-name" required>Item name</FieldLabel>
    <Input id="item-name" placeholder="All-purpose flour, 25 kg" />
  </Field>
  <Field data-invalid="true">
    <FieldLabel for="sku-taken" required>SKU</FieldLabel>
    <Input id="sku-taken" value="500000" aria-invalid="true" />
    <FieldDescription>Leave empty and one is generated on save.</FieldDescription>
    <FieldError>That SKU already belongs to another item.</FieldError>
  </Field>
</FieldGroup>
