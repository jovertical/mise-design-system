<!--
  Origin: the React package 2.23.0 `stepper.tsx` (`Stepper`)
  Diverged: React's `orientation` is `variant`, since only two of its four
    values are orientations (round 7 plan, R7-5). A step's `icon` is a component
    (a Tabler icon) rather than a node, so a steps array can live in a script;
    its `badge` is a snippet. `tourTarget` is dropped. The vertical rail honours
    `onStepSelect`, which React's ignored (its Selectable story, on the rail,
    could not be clicked), and marks the current step `aria-current`, as the
    other variants do. A step not yet reached, and compact's track, are
    `bg-foreground/[0.07]` rather than React's `bg-muted`, which vanished on the
    muted canvas a stepper sits on above a step body; a foreground wash reads on
    the page and on a card alike, as Skeleton's does. Each variant is its own
    part (`stepper-compact.svelte` and its siblings), picked here.
-->
<script lang="ts" module>
  import type { Component, Snippet } from 'svelte'

  export type StepDefinition = {
    id: string
    name: string
    description: string
    optional?: boolean
    /** Drawn in the step's chip by `horizontal` and `condensed`. */
    icon?: Component<{ class?: string }>
    /** Beside the current step's name under `condensed`'s chips. */
    badge?: Snippet
  }

  /**
   * `vertical` suits a fixed side rail. `horizontal` runs the steps across the
   * top of the page, above the step body. `condensed` is horizontal for long
   * flows: chips and a connector, with only the current step named. `compact`
   * is one line for narrow screens, where any of the others costs most of the
   * first screen before you reach a field.
   *
   * `horizontal` carries a name and a description per step, which is what
   * stops fitting: four steps is comfortable, six is tight, and nine scrolls.
   * `condensed` drops the per-step labels rather than the steps.
   */
  export type StepperVariant = 'vertical' | 'horizontal' | 'condensed' | 'compact'

  /**
   * Where a reader is in a multi-step flow, and what is behind them.
   */
  export type StepperProps = {
    /**
     * Each step's `id` and `name`, a `description` (required; `''` for none),
     * and optionally `optional`, an `icon` component and a `badge` snippet.
     */
    steps: StepDefinition[]
    currentStepId: string
    /**
     * Explicit completion. Any step id here is complete regardless of its
     * position; when omitted, every step before `currentStepId` is.
     */
    completedSteps?: readonly string[]
    variant?: StepperVariant
    /**
     * Drops the "Step 3 of 9" readout and the bar from `compact`, for a flow
     * that no longer holds anyone to an order. A bar that never moves is a
     * worse answer than none.
     */
    showProgress?: boolean
    /**
     * Drops the current step's name and description from `condensed`, for a
     * page that heads its own step body and says it better.
     */
    showCurrentStep?: boolean
    /**
     * Makes steps selectable. A stepper that reports progress and one that
     * navigates look the same and are not; passing this turns the steps into
     * buttons.
     */
    onStepSelect?: (stepId: string) => void
    /**
     * Which step ids accept a click; omitted means all of them. A wizard can
     * hold you to an order going forward while letting you back to anything
     * already visited.
     */
    selectableSteps?: readonly string[]
    class?: string
  }

  /** A step's place in the flow, resolved once so every layout agrees. */
  export type StepState = { completed: boolean; current: boolean }

  /** What Stepper hands the layout its `variant` picks. */
  export type StepperLayoutProps = {
    steps: StepDefinition[]
    states: StepState[]
    currentIndex: number
    canSelect: (stepId: string) => boolean
    onStepSelect?: (stepId: string) => void
    variant: StepperVariant
    class?: string
  }
</script>

<script lang="ts">
  import StepperCompact from './stepper-compact.svelte'
  import StepperCondensed from './stepper-condensed.svelte'
  import StepperHorizontal from './stepper-horizontal.svelte'
  import StepperVertical from './stepper-vertical.svelte'

  let {
    steps,
    currentStepId,
    completedSteps,
    variant = 'vertical',
    showProgress = true,
    showCurrentStep = true,
    onStepSelect,
    selectableSteps,
    class: className,
  }: StepperProps = $props()

  // Resolved once, so every variant agrees.
  const states = $derived.by(() => {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)
    const explicit = completedSteps ? new Set(completedSteps) : null

    return steps.map((step, index) => ({
      completed: explicit ? explicit.has(step.id) : index < currentIndex,
      current: step.id === currentStepId,
    }))
  })

  const currentIndex = $derived(
    Math.max(
      0,
      steps.findIndex((step) => step.id === currentStepId),
    ),
  )

  const selectable = $derived(selectableSteps ? new Set(selectableSteps) : null)

  const canSelect = (stepId: string) =>
    Boolean(onStepSelect) && (selectable === null || selectable.has(stepId))

  const layout = $derived({
    steps,
    states,
    currentIndex,
    canSelect,
    onStepSelect,
    variant,
    class: className,
  })
</script>

{#if variant === 'compact'}
  <StepperCompact {...layout} {showProgress} />
{:else if variant === 'condensed'}
  <StepperCondensed {...layout} {showCurrentStep} />
{:else if variant === 'horizontal'}
  <StepperHorizontal {...layout} />
{:else}
  <StepperVertical {...layout} />
{/if}
