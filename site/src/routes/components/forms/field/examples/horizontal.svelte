<!--
  `horizontal` is for a checkbox or a switch: control first, then the label
  and its description beside it, inside FieldContent so the description does
  not wrap back under the control.
-->
<script lang="ts">
  import {
    Checkbox,
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  } from '@jovertical/mise-design-system'
</script>

<FieldGroup class="max-w-md">
  <Field orientation="horizontal">
    <Checkbox id="publish" checked />
    <FieldContent>
      <FieldLabel for="publish">Publish on import</FieldLabel>
      <FieldDescription>
        Imported items go live on the registers. Leave this off to review them as drafts first.
      </FieldDescription>
    </FieldContent>
  </Field>
  <Field orientation="horizontal">
    <Checkbox id="stock" />
    <FieldContent>
      <FieldLabel for="stock">Import stock levels</FieldLabel>
      <FieldDescription
        >Stock is set to the quantity in the file for each location.</FieldDescription
      >
    </FieldContent>
  </Field>
</FieldGroup>
