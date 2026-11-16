<!--
  StepperNavigation: Back on the left, the primary on the right, and the
  primary never slides when Back is absent. `trailing` sits beside the
  primary, for a skip that still advances; `leading` at the far left, for
  leaving the flow. Submitting draws a spinner and holds the action.
-->
<script lang="ts">
  import { Button, StepperNavigation } from '@jovertical/mise-design-system'

  const stay = () => {}
</script>

{#snippet skip()}
  <Button variant="ghost">Skip this step</Button>
{/snippet}

{#snippet cancel()}
  <Button variant="ghost">Cancel</Button>
{/snippet}

<div class="flex w-full max-w-2xl flex-col gap-6">
  <StepperNavigation onNext={stay} nextLabel="Continue" leading={cancel} />
  <StepperNavigation onBack={stay} onNext={stay} trailing={skip} />
  <StepperNavigation
    onBack={stay}
    onNext={stay}
    nextLabel="Creating location"
    nextLoading
    nextDisabled
  />
</div>
