<!-- A set of ticks bound to an array of values, kept in the order of the options. -->
<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '@jovertical/mise-design-system'

  const LOCATIONS: CheckboxGroupOption[] = [
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot' },
    { value: 'harbour', label: 'Harbour store' },
  ]

  let value = $state(['north'])
</script>

<div class="w-full max-w-md">
  <CheckboxGroup
    legend="Locations"
    description="Where this shift runs."
    options={LOCATIONS}
    bind:value
  />
</div>
