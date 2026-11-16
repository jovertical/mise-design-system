<script lang="ts">
  import { type StepDefinition, Stepper, StepperNavigation } from '@jovertical/mise-design-system'

  const STEPS: StepDefinition[] = [
    { id: 'COMPANY', name: 'Company', description: 'Company details' },
    { id: 'LOCATION', name: 'First location', description: 'The first site' },
    { id: 'REGISTERS', name: 'Registers', description: 'Registers for the site' },
  ]

  const stay = () => {}
</script>

<div class="flex w-[34rem] flex-col gap-8">
  <Stepper steps={STEPS} currentStepId="LOCATION" variant="horizontal" />
  <StepperNavigation onBack={stay} onNext={stay} nextLabel="Continue" />
</div>
