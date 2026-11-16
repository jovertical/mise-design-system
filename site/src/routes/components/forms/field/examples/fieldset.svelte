<!--
  FieldSet groups fields that answer one question under a legend: a <legend>
  in a <fieldset> is what tells a screen reader they belong together.
  FieldSeparator takes a word, for groups that are alternatives.
-->
<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    Input,
  } from '@jovertical/mise-design-system'
</script>

<FieldSet class="w-full max-w-md">
  <FieldLegend variant="label">How rows are matched</FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel for="match-sku">Match on SKU</FieldLabel>
      <Input id="match-sku" placeholder="500000" />
      <FieldDescription>Exact match against the existing catalogue.</FieldDescription>
    </Field>
    <FieldSeparator>or</FieldSeparator>
    <Field>
      <FieldLabel for="match-barcode">Match on barcode</FieldLabel>
      <Input id="match-barcode" placeholder="4806500000001" />
      <FieldDescription>Used when the file carries no SKU column.</FieldDescription>
    </Field>
  </FieldGroup>
</FieldSet>
