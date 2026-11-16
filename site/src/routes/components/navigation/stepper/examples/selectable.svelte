<!--
  Progress and reachability are different questions. `onStepSelect` alone
  makes every step a button; `selectableSteps` keeps the stepper from
  offering a door the flow would bounce you off. `completedSteps` overrides
  position: here Tax registration was skipped and stays hollow.
-->
<script lang="ts">
  import { type StepDefinition, Stepper } from '@jovertical/mise-design-system'

  const STEPS: StepDefinition[] = [
    { id: 'COMPANY', name: 'Company', description: 'Company details' },
    { id: 'TAX', name: 'Tax registration', description: 'Registration status' },
    { id: 'LOCATION', name: 'First location', description: 'The first site' },
    { id: 'REGISTERS', name: 'Registers', description: 'Registers for the site' },
    { id: 'COMPLETE', name: 'Complete', description: 'Review and finish' },
  ]

  let current = $state('LOCATION')
</script>

<div class="max-w-sm">
  <Stepper
    steps={STEPS}
    currentStepId={current}
    completedSteps={['COMPANY']}
    onStepSelect={(stepId) => (current = stepId)}
    selectableSteps={['COMPANY', 'TAX', 'LOCATION']}
  />
</div>
