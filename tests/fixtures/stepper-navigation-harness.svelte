<script lang="ts">
  import { Button, StepperNavigation } from '../../src/lib/index.js'

  let {
    onBack,
    onNext,
    nextLoading = false,
    nextDisabled = false,
    withLeading = false,
    withTrailing = false,
  }: {
    onBack?: () => void
    onNext?: () => void
    nextLoading?: boolean
    nextDisabled?: boolean
    withLeading?: boolean
    withTrailing?: boolean
  } = $props()
</script>

{#snippet cancel()}
  <Button variant="ghost">Cancel</Button>
{/snippet}

{#snippet skip()}
  <Button variant="ghost">Skip this step</Button>
{/snippet}

<StepperNavigation
  {onBack}
  {onNext}
  {nextLoading}
  {nextDisabled}
  leading={withLeading ? cancel : undefined}
  trailing={withTrailing ? skip : undefined}
/>
