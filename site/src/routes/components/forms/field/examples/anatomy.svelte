<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    Input,
  } from '@jovertical/mise-design-system'
</script>

<Field class="w-80" data-invalid="true">
  <FieldLabel for="anatomy-sku" required>SKU</FieldLabel>
  <Input id="anatomy-sku" value="500000" aria-invalid="true" />
  <FieldDescription>Leave empty and one is generated on save.</FieldDescription>
  <FieldError>That SKU already belongs to another item.</FieldError>
</Field>
