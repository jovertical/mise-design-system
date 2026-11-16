<!-- One option disabled, invalid with its error, and nothing to choose. -->
<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '@jovertical/mise-design-system'

  const LOCATIONS: CheckboxGroupOption[] = [
    { value: 'north', label: 'North depot' },
    { value: 'south', label: 'South depot' },
    { value: 'harbour', label: 'Harbour store', disabled: true },
  ]
</script>

<div class="grid w-full max-w-3xl gap-10 sm:grid-cols-3">
  <CheckboxGroup legend="One disabled" options={LOCATIONS} />
  <CheckboxGroup
    legend="Invalid"
    options={LOCATIONS.slice(0, 2)}
    errors={[{ message: 'Pick at least one location.' }]}
  />
  <CheckboxGroup legend="Empty" options={[]} empty="No locations yet." />
</div>
