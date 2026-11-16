<!-- Horizontal wraps short labels along a row; vertical is for anything with a description. -->
<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '@jovertical/mise-design-system'

  const DAYS: CheckboxGroupOption[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (day) => ({ value: day.toLowerCase(), label: day }),
  )

  let value = $state(['mon', 'wed', 'fri'])
</script>

<div class="w-full max-w-lg">
  <CheckboxGroup legend="Delivery days" options={DAYS} orientation="horizontal" bind:value />
</div>
