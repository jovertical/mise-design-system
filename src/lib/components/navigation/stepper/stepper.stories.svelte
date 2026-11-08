<script module lang="ts">
  import BanknoteIcon from '@lucide/svelte/icons/banknote'
  import DatabaseIcon from '@lucide/svelte/icons/database'
  import FileCheckIcon from '@lucide/svelte/icons/file-check'
  import MonitorIcon from '@lucide/svelte/icons/monitor'
  import ReceiptTextIcon from '@lucide/svelte/icons/receipt-text'
  import SproutIcon from '@lucide/svelte/icons/sprout'
  import StoreIcon from '@lucide/svelte/icons/store'
  import UserPlusIcon from '@lucide/svelte/icons/user-plus'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import Stepper, { type StepDefinition } from './stepper.svelte'
  import StepperNavigation from './stepper-navigation.svelte'

  /*
    A nine-step business setup: the longest kind of flow, where a stepper's
    layout decisions stop being theoretical.
  */
  const STEPS: StepDefinition[] = [
    {
      id: 'COMPANY',
      name: 'Company Info',
      description: 'Company details and logo',
      icon: StoreIcon,
    },
    {
      id: 'TAX',
      name: 'Tax Registration',
      description: 'Select tax registration status',
      icon: ReceiptTextIcon,
    },
    {
      id: 'ADMIN',
      name: 'Admin User',
      description: 'Create the admin account',
      icon: UserPlusIcon,
    },
    {
      id: 'DATABASE',
      name: 'Database Setup',
      description: 'Provision the database',
      icon: DatabaseIcon,
    },
    {
      id: 'LOCATION',
      name: 'First Location',
      description: 'Create the first location',
      icon: StoreIcon,
    },
    {
      id: 'REGISTERS',
      name: 'Registers',
      description: 'Set up registers for the location',
      icon: MonitorIcon,
    },
    {
      id: 'BILLING',
      name: 'Billing Preference',
      description: 'Choose how billing works',
      icon: BanknoteIcon,
    },
    {
      id: 'SEEDING',
      name: 'Initial Data',
      description: 'Choose initial data options',
      icon: SproutIcon,
    },
    {
      id: 'COMPLETE',
      name: 'Complete',
      description: 'Review and finish setup',
      icon: FileCheckIcon,
    },
  ]
  const SHORT = STEPS.slice(0, 4)
  const SKIPPED = ['COMPANY', 'TAX', 'ADMIN', 'DATABASE', 'LOCATION']
  const REACHED = STEPS.slice(0, 5).map((step) => step.id)

  const { Story } = defineMeta({
    title: 'Navigation/Stepper',
    component: Stepper,
    tags: ['mise'],
    args: { steps: STEPS, currentStepId: 'LOCATION', variant: 'vertical' },
    argTypes: {
      variant: {
        control: 'inline-radio',
        options: ['vertical', 'horizontal', 'condensed', 'compact'],
      },
    },
  })

  const selection = $state({ current: 'LOCATION' })
  const flow = $state({ index: 1 })
</script>

<!-- A fixed side rail. Completed steps collapse to a check; the rest keep their number. -->
<Story name="Playground">
  {#snippet template(args)}
    <div class="max-w-sm"><Stepper {...args} /></div>
  {/snippet}
</Story>

<!--
  The four variants. `horizontal` reads well at four steps; `condensed` is
  horizontal for long flows, chips and a connector with only the current step
  named; `compact` is one line for narrow screens.
-->
<Story name="Variants" asChild>
  <StoryAxis
    values={['vertical', 'horizontal', 'condensed', 'compact'] as const}
    orientation="vertical"
  >
    {#snippet item(variant)}
      <div class={variant === 'vertical' ? 'max-w-sm' : 'max-w-3xl'}>
        <Stepper
          steps={variant === 'horizontal' ? SHORT : STEPS}
          currentStepId={variant === 'horizontal' ? 'ADMIN' : 'REGISTERS'}
          {variant}
        />
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  In place above a step body, with `StepperNavigation` under it at the page's
  own level. Next and Back move the flow.
-->
<Story name="In a flow" asChild>
  <div class="flex max-w-3xl flex-col gap-6">
    <Stepper steps={SHORT} currentStepId={SHORT[flow.index].id} variant="horizontal" />
    <Card>
      <CardContent class="text-muted-foreground py-12 text-center text-sm">
        {SHORT[flow.index].description}
      </CardContent>
    </Card>
    <StepperNavigation
      onBack={flow.index > 0 ? () => (flow.index -= 1) : undefined}
      onNext={() => (flow.index = Math.min(flow.index + 1, SHORT.length - 1))}
      nextDisabled={flow.index === SHORT.length - 1}
    />
  </div>
</Story>

<!--
  `showCurrentStep={false}` drops the label under the chips, for a page that
  heads its own step body, which says it better anyway.
-->
<Story name="Condensed without label" asChild>
  <div class="max-w-3xl">
    <Stepper steps={STEPS} currentStepId="REGISTERS" variant="condensed" showCurrentStep={false} />
  </div>
</Story>

<!--
  Condensed at four steps, where `horizontal` is still comfortable: the two are
  a choice about how much room the labels are worth, not a rule about count.
-->
<Story name="Condensed short" asChild>
  <div class="max-w-3xl"><Stepper steps={SHORT} currentStepId="ADMIN" variant="condensed" /></div>
</Story>

<!--
  Condensed with the flow jumped around in. The current chip keeps its ring
  even where the step is also complete; a step passed over is left unfilled,
  but the line still runs through it to where you are.
-->
<Story name="Condensed with skips" asChild>
  <div class="max-w-3xl">
    <Stepper steps={STEPS} currentStepId="BILLING" variant="condensed" completedSteps={SKIPPED} />
  </div>
</Story>

<!--
  `showProgress={false}` drops compact's readout and bar, for a flow that no
  longer holds anyone to an order: a bar that never moves is worse than none.
-->
<Story name="Compact without progress" asChild>
  <div class="max-w-md">
    <Stepper steps={STEPS} currentStepId="REGISTERS" variant="compact" showProgress={false} />
  </div>
</Story>

<!--
  `completedSteps` overrides position. Without it the stepper assumes everything
  before the current step is done, which is only true of a flow nobody jumped
  around in. Here Registers was skipped and stays hollow.
-->
<Story name="Explicit completion" asChild>
  <div class="max-w-sm">
    <Stepper steps={STEPS} currentStepId="BILLING" completedSteps={SKIPPED} />
  </div>
</Story>

<!--
  Progress and reachability are different questions. `onStepSelect` alone would
  make every step a button, including the ones the flow would bounce you off;
  `selectableSteps` keeps the stepper from offering a door it cannot open.
  Click a reached step; the later ones do not respond.
-->
<Story name="Selectable" asChild>
  <div class="max-w-sm">
    <Stepper
      steps={STEPS}
      currentStepId={selection.current}
      onStepSelect={(stepId) => (selection.current = stepId)}
      selectableSteps={REACHED}
    />
  </div>
</Story>
