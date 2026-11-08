<!--
  Origin: the React package 2.23.0 `stepper.tsx` (`Stepper`)
  Diverged: React's `orientation` is `variant`, since only two of its four
    values are orientations (round 7 plan, R7-5). A step's `icon` is a
    component (a Lucide icon) rather than a node, so a steps array can live in a
    script; its `badge` is a snippet. `tourTarget` is dropped. The vertical rail
    honours `onStepSelect`, which React's ignored (its Selectable story, on the
    rail, could not be clicked), and marks the current step `aria-current`, as
    the other variants do. A step not yet reached, and compact's track, are
    `bg-foreground/[0.07]` rather than React's `bg-muted`, which vanished on the
    muted canvas a stepper sits on above a step body; a foreground wash reads
    on the page and on a card alike, as Skeleton's does. Lucide's check and
    chevron-right.
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
</script>

<script lang="ts">
  import CheckIcon from '@lucide/svelte/icons/check'
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'
  import Text from '../../typography/text/text.svelte'
  import StepperChip from './stepper-chip.svelte'

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
  const currentStep = $derived(steps[currentIndex])
  const selectable = $derived(selectableSteps ? new Set(selectableSteps) : null)
  const canSelect = (stepId: string) =>
    Boolean(onStepSelect) && (selectable === null || selectable.has(stepId))

  // How far condensed's line runs: to the last step reached, so an optional step
  // the flow stepped over does not leave a grey gap in an otherwise filled line.
  const lastReachedIndex = $derived(
    states.reduce((last, state, index) => (state.completed || state.current ? index : last), -1),
  )
</script>

{#if variant === 'compact'}
  <div data-slot="stepper" data-variant={variant} class={cn('flex flex-col gap-2', className)}>
    <div class="flex items-baseline justify-between gap-3">
      <div class="min-w-0">
        {#if showProgress}
          <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            Step {currentIndex + 1} of {steps.length}
          </p>
        {/if}
        <!-- Truncated, not wrapped: a two-line name would push the form down by
             exactly the amount the compact form exists to save. -->
        <p class="truncate text-base font-semibold">{currentStep?.name}</p>
      </div>
      {#if showProgress}
        <p class="text-muted-foreground shrink-0 text-sm font-medium tabular-nums">
          {currentIndex + 1}/{steps.length}
        </p>
      {/if}
    </div>

    {#if currentStep?.description}
      <Text as="p" size="sm" muted>{currentStep.description}</Text>
    {/if}

    {#if showProgress}
      <div
        class="bg-foreground/[0.07] h-1 w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={currentIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label="Progress"
      >
        <div
          class="bg-primary h-full transition-all"
          style:width="{((currentIndex + 1) / steps.length) * 100}%"
        ></div>
      </div>
    {/if}
  </div>
{:else if variant === 'condensed'}
  <nav
    aria-label="Progress"
    data-slot="stepper"
    data-variant={variant}
    class={cn('flex w-full flex-col gap-3', className)}
  >
    <ol class="flex items-center">
      {#each steps as step, index (step.id)}
        {@const { completed, current } = states[index]}
        {#if index > 0}
          <!-- The connector fills what is left, so the row spans its container
               at any step count instead of bunching left. -->
          <li
            aria-hidden="true"
            class={cn(
              'h-0.5 min-w-3 flex-1 rounded-full',
              index <= lastReachedIndex ? 'bg-primary' : 'bg-border',
            )}
          ></li>
        {/if}
        <li class="shrink-0">
          <StepperChip
            selectable={canSelect(step.id)}
            onSelect={() => onStepSelect?.(step.id)}
            name={step.name}
          >
            <span
              class={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-semibold [&_svg]:size-4',
                current && 'bg-primary text-primary-foreground ring-primary/30 ring-2',
                completed && !current && 'bg-primary text-primary-foreground',
                !completed && !current && 'bg-foreground/[0.07] text-muted-foreground',
              )}
              aria-current={current ? 'step' : undefined}
            >
              {#if completed && !current}
                <CheckIcon />
              {:else if step.icon}
                <step.icon />
              {:else}
                {index + 1}
              {/if}
              <!-- The chips carry no visible text, so the name reaches a screen
                   reader this way. -->
              <span class="sr-only">{step.name}</span>
            </span>
          </StepperChip>
        </li>
      {/each}
    </ol>

    {#if showCurrentStep}
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <p class="text-sm leading-tight font-medium">{currentStep?.name}</p>
          {@render currentStep?.badge?.()}
        </div>
        {#if currentStep?.description}
          <p class="text-muted-foreground mt-0.5 text-xs leading-tight">
            {currentStep.description}
          </p>
        {/if}
      </div>
    {/if}
  </nav>
{:else if variant === 'horizontal'}
  <!-- Steps never shrink: a half-truncated name is worse than a scroll, so the
       row scrolls inside itself rather than widening the page. -->
  <nav
    aria-label="Progress"
    data-slot="stepper"
    data-variant={variant}
    class={cn('w-full overflow-x-auto p-1', className)}
  >
    <ol class="flex items-start justify-between gap-4 max-md:flex-col">
      {#each steps as step, index (step.id)}
        {@const { completed, current } = states[index]}
        {#if index > 0}
          <!-- Its own li, so it drops out where the row stacks and an arrow
               pointing right would point at nothing. -->
          <li aria-hidden="true" class="mt-2.5 self-start max-md:hidden">
            <ChevronRightIcon class="text-muted-foreground size-4" />
          </li>
        {/if}
        <li class="flex shrink-0 items-start gap-4">
          <StepperChip
            selectable={canSelect(step.id)}
            onSelect={() => onStepSelect?.(step.id)}
            name={step.name}
          >
            <!-- Filled once reached: current and completed look alike on
                 purpose, because the body below says which one you are on. -->
            <span
              class={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full [&_svg]:size-4',
                completed || current
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-foreground/[0.07] text-foreground',
              )}
              aria-current={current ? 'step' : undefined}
            >
              {#if step.icon}
                <step.icon />
              {:else}
                <span class="text-xs font-semibold">{index + 1}</span>
              {/if}
            </span>
            <span class="flex min-w-0 flex-col items-start">
              <span class="text-sm font-medium whitespace-nowrap">{step.name}</span>
              <!-- Held to two lines and a fixed measure, so a long description
                   costs height rather than pushing the last step off the edge. -->
              <span class="text-muted-foreground line-clamp-2 max-w-36 text-xs break-words">
                {step.description}
              </span>
            </span>
          </StepperChip>
        </li>
      {/each}
    </ol>
  </nav>
{:else}
  <nav
    aria-label="Progress"
    data-slot="stepper"
    data-variant={variant}
    class={cn('w-full', className)}
  >
    <ol class="space-y-1">
      {#each steps as step, index (step.id)}
        {@const { completed, current } = states[index]}
        <li class="relative">
          <StepperChip
            selectable={canSelect(step.id)}
            onSelect={() => onStepSelect?.(step.id)}
            name={step.name}
            class="flex w-full items-start gap-3 rounded-lg px-3 py-3 transition-colors"
          >
            <div class="shrink-0 pt-0.5">
              {#if completed}
                <div
                  class="bg-primary flex size-8 items-center justify-center rounded-full"
                  aria-current={current ? 'step' : undefined}
                >
                  <CheckIcon class="text-primary-foreground size-4" />
                </div>
              {:else}
                <div
                  class={cn(
                    'flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                    current
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground/[0.07] text-muted-foreground',
                  )}
                  aria-current={current ? 'step' : undefined}
                >
                  {index + 1}
                </div>
              {/if}
            </div>
            <!-- A rail is dense navigation, not body copy: one notch down each,
                 and muted for anything not reached, is what survives nine steps
                 in a 320px rail. -->
            <div class="mt-0.5 min-w-0 flex-1">
              <p
                class={cn(
                  'text-sm leading-tight font-medium',
                  completed && 'text-primary',
                  current && 'text-foreground',
                  !completed && !current && 'text-muted-foreground',
                )}
              >
                {step.name}
              </p>
              <p
                class={cn(
                  'mt-0.5 text-xs leading-tight',
                  current ? 'text-muted-foreground' : 'text-muted-foreground/70',
                )}
              >
                {step.description}
              </p>
            </div>
          </StepperChip>
          {#if index < steps.length - 1}
            <div
              class={cn(
                'absolute top-[50px] left-[27px] h-[calc(100%-36px)] w-0.5',
                completed ? 'bg-primary' : 'bg-border',
              )}
            ></div>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>
{/if}
