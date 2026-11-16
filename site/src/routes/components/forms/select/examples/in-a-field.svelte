<!-- In a form, a select sits in a Field like any input, full width. -->
<script lang="ts">
  import {
    Field,
    FieldDescription,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@jovertical/mise-design-system'

  const SERVICES = [
    { value: 'standard', label: 'Standard' },
    { value: 'express', label: 'Express' },
    { value: 'same-day', label: 'Same day' },
  ]

  let value = $state('standard')
</script>

<Field class="max-w-sm">
  <FieldLabel for="service">Service</FieldLabel>
  <Select bind:value items={SERVICES}>
    <SelectTrigger id="service">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {#each SERVICES as service (service.value)}
        <SelectItem value={service.value} label={service.label} />
      {/each}
    </SelectContent>
  </Select>
  <FieldDescription>Same day closes at 11:00.</FieldDescription>
</Field>
