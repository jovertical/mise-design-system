<!--
  Origin: the React package 2.23.0 `hint.tsx`
  Diverged: spreads the rest onto the button, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  /**
   * The `?` that explains the thing it sits beside.
   *
   * Named for the slot it fills: `StatTile` takes a `hint`, and a heading takes
   * one inline because `CardTitle` is a flex row. It carries what a caption
   * cannot fit and says it only to whoever asks, which is why it beats
   * lengthening the label or adding a second line under it.
   *
   * **A `button`, not a bare icon.** A tooltip anchored to a non-focusable
   * element never opens for a keyboard, so the explanation simply does not
   * exist for anyone not using a mouse. `aria-label` falls back to "More info"
   * when no `label` is given, which is worse than a real one and better than
   * nothing.
   *
   * Use it sparingly: one per figure is plenty. A screen where every caption
   * has a `?` has moved its documentation into tooltips, and none of it is
   * readable without hunting.
   */
  export type HintProps = Omit<HTMLButtonAttributes, 'children'> & {
    /**
     * Announced in place of the glyph, so name what is being explained ("How
     * stock health is calculated", not "Help").
     */
    label?: string
    /** The explanation, shown in the tooltip. */
    children: Snippet
  }
</script>

<script lang="ts">
  import IconHelp from '@tabler/icons-svelte-runes/icons/help'

  import { cn } from '../../../utils/cn.js'
  import Tooltip from '../tooltip/tooltip.svelte'
  import TooltipContent from '../tooltip/tooltip-content.svelte'
  import TooltipTrigger from '../tooltip/tooltip-trigger.svelte'

  let { label, children, class: className, ...rest }: HintProps = $props()
</script>

<Tooltip>
  <TooltipTrigger>
    {#snippet child({ props })}
      <button
        type="button"
        aria-label={label ?? 'More info'}
        class={cn(
          'text-muted-foreground hover:text-foreground focus-visible:text-foreground focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-4 shrink-0 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          className,
        )}
        {...props}
        {...rest}
      >
        <IconHelp class="size-3.5" />
      </button>
    {/snippet}
  </TooltipTrigger>

  <TooltipContent class="max-w-xs text-balance">{@render children()}</TooltipContent>
</Tooltip>
