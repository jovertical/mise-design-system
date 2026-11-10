<!--
  Origin: the React package 2.23.0 `stepper.tsx` (the `vertical` layout)
  Diverged: Stepper's `vertical` variant as its own part, so Stepper keeps under
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
    canSelect,
    onStepSelect,
    variant,
    class: className,
  }: StepperLayoutProps = $props()
</script>

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
                <IconCheck class="text-primary-foreground size-4" />
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
