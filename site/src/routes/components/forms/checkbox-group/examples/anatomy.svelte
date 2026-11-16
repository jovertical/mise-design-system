<script lang="ts">
  import { CheckboxGroup, type CheckboxGroupOption } from '@jovertical/mise-design-system'

  const DUTIES: CheckboxGroupOption[] = [
    { value: 'receiving', label: 'Receiving', description: 'Checks deliveries against the order.' },
    { value: 'picking', label: 'Picking', description: 'Pulls stock for outgoing orders.' },
  ]
</script>

<div class="w-96">
  <CheckboxGroup
    legend="Duties"
    description="What they may do on a shift."
    options={DUTIES}
    value={['picking']}
    errors={[{ message: 'Pick at least one duty.' }]}
  />
</div>
