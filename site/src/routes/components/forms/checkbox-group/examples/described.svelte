<!-- A line under each option, for choices whose names do not explain themselves. -->
<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '@jovertical/mise-design-system'

  const DUTIES: CheckboxGroupOption[] = [
    { value: 'receiving', label: 'Receiving', description: 'Checks deliveries against the order.' },
    { value: 'picking', label: 'Picking', description: 'Pulls stock for outgoing orders.' },
    { value: 'counting', label: 'Counting', description: 'Runs the weekly stock count.' },
  ]

  let value = $state(['picking'])
</script>

<div class="w-full max-w-md">
  <CheckboxGroup legend="Duties" options={DUTIES} bind:value />
</div>
