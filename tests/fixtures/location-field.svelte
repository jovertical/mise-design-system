<script lang="ts">
  import type { FieldOrientation } from '../../src/lib/index.js'
  import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    Input,
  } from '../../src/lib/index.js'

  let {
    errors,
    orientation,
  }: { errors?: Array<{ message?: string }>; orientation?: FieldOrientation } = $props()
</script>

<FieldGroup>
  <Field {orientation} data-invalid={errors?.length ? true : undefined}>
    <FieldLabel for="location-name" required>Location name</FieldLabel>
    <Input id="location-name" aria-invalid={errors?.length ? true : undefined} />
    <FieldDescription>Shown on receipts.</FieldDescription>
    <FieldError {errors} />
  </Field>
</FieldGroup>
