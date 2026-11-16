<!-- Each choice with a line under it, laid out by a horizontal Field. -->
<script lang="ts">
  import {
    Field,
    FieldContent,
    FieldDescription,
    FieldLabel,
    RadioGroup,
    RadioGroupItem,
  } from '@jovertical/mise-design-system'

  const SERVICES = [
    { value: 'standard', label: 'Standard', description: 'Two working days, any time of day.' },
    { value: 'express', label: 'Express', description: 'Next morning, before 10:00.' },
  ]

  let service = $state('standard')
</script>

<RadioGroup bind:value={service} aria-label="Service" class="max-w-md">
  {#each SERVICES as option (option.value)}
    <Field orientation="horizontal">
      <RadioGroupItem value={option.value} id="service-{option.value}" />
      <FieldContent>
        <FieldLabel for="service-{option.value}">{option.label}</FieldLabel>
        <FieldDescription>{option.description}</FieldDescription>
      </FieldContent>
    </Field>
  {/each}
</RadioGroup>
