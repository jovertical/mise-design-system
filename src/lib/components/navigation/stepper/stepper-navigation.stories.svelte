<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Button from '../../actions/button/button.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import StepperNavigation from './stepper-navigation.svelte'

  const noop = () => {}

  const { Story } = defineMeta({
    title: 'Navigation/Stepper/Navigation',
    component: StepperNavigation,
    tags: ['mise'],
    args: { onBack: noop, onNext: noop },
  })
</script>

{#snippet skip()}
  <Button variant="ghost">Skip this step</Button>
{/snippet}

{#snippet cancel()}
  <Button variant="ghost">Cancel</Button>
{/snippet}

<!-- Back on the left, the primary on the right. -->
<Story name="Playground">
  {#snippet template(args)}
    <StepperNavigation {...args} />
  {/snippet}
</Story>

<!--
  The first step has no back action, and Next does not slide left to fill the
  gap: a primary that moves between step one and step two is one the reader
  has to look for twice. Submitting draws a spinner and holds the action.
-->
<Story name="States" asChild>
  <div class="flex flex-col gap-6">
    <StepperNavigation onNext={noop} nextLabel="Continue" />
    <StepperNavigation
      onBack={noop}
      onNext={noop}
      nextLabel="Creating location"
      nextLoading
      nextDisabled
    />
  </div>
</Story>

<!-- `trailing` sits immediately left of the primary: a skip still advances. -->
<Story name="With skip" asChild>
  <StepperNavigation onBack={noop} onNext={noop} trailing={skip} />
</Story>

<!--
  `leading` sits at the far left, opposite the primary, for anything that leaves
  the flow rather than moving through it. Beside the primary, Cancel would be
  just a quieter button next to the one you want.
-->
<Story name="With cancel" asChild>
  <StepperNavigation onNext={noop} nextLabel="Continue" leading={cancel} />
</Story>

<!--
  In place: outside the card, not in its footer. A CardFooter binds the controls
  to one card, which stops working the moment a step has two.
-->
<Story name="In a step body" asChild>
  <div class="flex flex-col gap-6">
    <Card>
      <CardContent class="text-muted-foreground py-12 text-center text-sm">
        Company name, industry, business type
      </CardContent>
    </Card>
    <StepperNavigation onBack={noop} onNext={noop} nextLabel="Continue" />
  </div>
</Story>
