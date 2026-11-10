<!--
  Origin: the React package 2.23.0 `stepper-navigation.tsx`
  Diverged: `leading` and `trailing` are snippets. Spreads the rest onto the
    row, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A flow's controls, at the page's own level rather than inside its card.
   *
   * Where the buttons sit is the argument for this existing. A `CardFooter`
   * binds them to one card, which is wrong the moment a step has two: the
   * reader has to work out which card's footer moves the flow. Outside, they
   * belong to the step, and every step's primary action is in the same place
   * whether that step is one form, three cards, or a status screen.
   *
   * Handlers rather than routes, so the package needs no router.
   */
  export type StepperNavigationProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    /** Omit for the first step. The next action stays right regardless. */
    onBack?: () => void
    backLabel?: string
    backDisabled?: boolean
    onNext?: () => void
    nextLabel?: string
    nextDisabled?: boolean
    /** Draws a spinner in the next action. Pair it with `nextDisabled`. */
    nextLoading?: boolean
    /**
     * At the left end, beside the back action if there is one: anything that
     * leaves the flow rather than moving through it (Cancel, "finish later").
     * Leaving and advancing are opposite intentions and belong at opposite
     * ends.
     */
    leading?: Snippet
    /** Immediately left of the next action: a skip, which does advance. */
    trailing?: Snippet
  }
</script>

<script lang="ts">
  import IconChevronLeft from '@tabler/icons-svelte-runes/icons/chevron-left'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'
  import IconLoader from '@tabler/icons-svelte-runes/icons/loader'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'

  let {
    onBack,
    backLabel = 'Back',
    backDisabled = false,
    onNext,
    nextLabel = 'Next',
    nextDisabled = false,
    nextLoading = false,
    leading,
    trailing,
    class: className,
    ...rest
  }: StepperNavigationProps = $props()

  const group =
    'flex flex-col-reverse gap-2 [&>*]:w-full sm:flex-row sm:items-center sm:gap-2 sm:[&>*]:w-auto'
</script>

<!-- Stacked and full width on a phone, where two buttons side by side are each
     too small to hit; the primary ends up on top because flex-col-reverse
     reverses a row whose primary is last. -->
<div
  data-slot="stepper-navigation"
  class={cn(
    'flex flex-col-reverse gap-2 [&>*]:w-full sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:[&>*]:w-auto',
    className,
  )}
  {...rest}
>
  {#if onBack || leading}
    <div class={group}>
      {#if onBack}
        <Button variant="outline" onclick={onBack} disabled={backDisabled} type="button">
          <IconChevronLeft class="size-4" />
          {backLabel}
        </Button>
      {/if}
      {@render leading?.()}
    </div>
  {:else}
    <!-- Holds the left end so the next action stays right on a step with
         neither: a primary that moves between step one and step two is one the
         reader has to look for twice. -->
    <div class="hidden sm:block"></div>
  {/if}

  {#if onNext || trailing}
    <div class={group}>
      {@render trailing?.()}
      {#if onNext}
        <Button onclick={onNext} disabled={nextDisabled} type="button">
          {#if nextLoading}
            <IconLoader class="size-4 animate-spin" />
          {/if}
          {nextLabel}
          <IconChevronRight class="size-4" />
        </Button>
      {/if}
    </div>
  {/if}
</div>
