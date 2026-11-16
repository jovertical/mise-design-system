<!--
  `vertical` is a side rail; `horizontal` reads well at four steps;
  `condensed` is horizontal for long flows, with only the current step named;
  `compact` is one line for narrow screens.
-->
<script lang="ts">
  import {
    type StepDefinition,
    Stepper,
    ToggleGroup,
    ToggleGroupItem,
  } from '@jovertical/mise-design-system'

  const STEPS: StepDefinition[] = [
    { id: 'COMPANY', name: 'Company', description: 'Company details' },
    { id: 'TAX', name: 'Tax registration', description: 'Registration status' },
    { id: 'LOCATION', name: 'First location', description: 'The first site' },
    { id: 'REGISTERS', name: 'Registers', description: 'Registers for the site' },
    { id: 'BILLING', name: 'Billing', description: 'How billing works' },
    { id: 'COMPLETE', name: 'Complete', description: 'Review and finish' },
  ]

  const VARIANTS = ['vertical', 'horizontal', 'condensed', 'compact'] as const

  let variant: (typeof VARIANTS)[number] = $state('condensed')
</script>

<div class="flex w-full max-w-3xl flex-col gap-6">
  <ToggleGroup type="single" bind:value={variant} aria-label="Variant">
    {#each VARIANTS as option (option)}
      <ToggleGroupItem value={option}>{option}</ToggleGroupItem>
    {/each}
  </ToggleGroup>
  <div class={variant === 'vertical' ? 'max-w-sm' : ''}>
    <Stepper steps={STEPS} currentStepId="REGISTERS" {variant} />
  </div>
</div>
