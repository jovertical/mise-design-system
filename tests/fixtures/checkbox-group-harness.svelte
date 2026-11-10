<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '../../src/lib/index.js'

  const LOCATIONS: CheckboxGroupOption[] = [
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot', description: 'Closed on Sundays' },
    { value: 'harbour', label: 'Harbour store', disabled: true },
  ]

  let {
    value = $bindable<string[]>([]),
    options = LOCATIONS,
    errors,
    name,
  }: {
    value?: string[]
    options?: CheckboxGroupOption[]
    errors?: Array<{ message?: string } | undefined>
    name?: string
  } = $props()
</script>

<CheckboxGroup
  bind:value
  {options}
  {errors}
  {name}
  legend="Locations"
  description="Where this shift runs."
/>
<output data-testid="value">{value.join(',')}</output>
