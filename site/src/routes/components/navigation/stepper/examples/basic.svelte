<!--
  In place above a step body, with StepperNavigation under it at the page's
  own level, not in the card's footer. Next and Back move the flow.
-->
<script lang="ts">
  import {
    Card,
    CardContent,
    type StepDefinition,
    Stepper,
    StepperNavigation,
  } from '@jovertical/mise-design-system'

  const STEPS: StepDefinition[] = [
    { id: 'COMPANY', name: 'Company', description: 'Company details and logo' },
    { id: 'LOCATION', name: 'First location', description: 'Create the first location' },
    { id: 'REGISTERS', name: 'Registers', description: 'Set up registers for the location' },
    { id: 'COMPLETE', name: 'Complete', description: 'Review and finish setup' },
  ]

  let index = $state(1)
</script>

<div class="flex w-full max-w-3xl flex-col gap-6">
  <Stepper steps={STEPS} currentStepId={STEPS[index].id} variant="horizontal" />
  <Card>
    <CardContent class="text-muted-foreground py-12 text-center text-sm">
      {STEPS[index].description}
    </CardContent>
  </Card>
  <StepperNavigation
    onBack={index > 0 ? () => (index -= 1) : undefined}
    onNext={() => (index = Math.min(index + 1, STEPS.length - 1))}
    nextDisabled={index === STEPS.length - 1}
  />
</div>
