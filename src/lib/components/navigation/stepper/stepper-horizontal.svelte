<!--
  Origin: the React package 2.23.0 `stepper.tsx` (the `horizontal` layout)
  Diverged: Stepper's `horizontal` variant as its own part, so Stepper keeps under
    the size the clean-code guide allows. Not exported.
-->
<script lang="ts">
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right'

  import { cn } from '../../../utils/cn.js'
  import type { StepperLayoutProps } from './stepper.svelte'
  import StepperChip from './stepper-chip.svelte'

  let {
    steps,
    states,
    canSelect,
    onStepSelect,
    variant,
    class: className,
  }: StepperLayoutProps = $props()
</script>

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
