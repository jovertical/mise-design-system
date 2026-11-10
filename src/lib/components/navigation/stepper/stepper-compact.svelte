<!--
  Origin: the React package 2.23.0 `stepper.tsx` (the `compact` layout)
  Diverged: Stepper's `compact` variant as its own part, so Stepper keeps under
    the size the clean-code guide allows. Not exported.
-->
<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Text from '../../typography/text/text.svelte'

  import type { StepperLayoutProps } from './stepper.svelte'

  let {
    steps,
    currentIndex,
    variant,
    showProgress,
    class: className,
  }: StepperLayoutProps & { showProgress: boolean } = $props()

  const currentStep = $derived(steps[currentIndex])
</script>

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
