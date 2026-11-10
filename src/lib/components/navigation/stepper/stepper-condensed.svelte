<!--
  Origin: the React package 2.23.0 `stepper.tsx` (the `condensed` layout)
  Diverged: Stepper's `condensed` variant as its own part, so Stepper keeps under
    the size the clean-code guide allows. Not exported.
-->
<script lang="ts">
  import IconCheck from '@tabler/icons-svelte-runes/icons/check'

  import { cn } from '../../../utils/cn.js'
  import type { StepperLayoutProps } from './stepper.svelte'
  import StepperChip from './stepper-chip.svelte'

  let {
    steps,
    states,
    currentIndex,
    canSelect,
    onStepSelect,
    variant,
    showCurrentStep,
    class: className,
  }: StepperLayoutProps & { showCurrentStep: boolean } = $props()

  const currentStep = $derived(steps[currentIndex])

  // How far the line runs: to the last step reached, so an optional step the
  // flow stepped over does not leave a grey gap in an otherwise filled line.
  const lastReachedIndex = $derived(
    states.reduce((last, state, index) => (state.completed || state.current ? index : last), -1),
  )
</script>

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
              <IconCheck />
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
