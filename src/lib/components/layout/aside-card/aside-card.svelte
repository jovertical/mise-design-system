<!--
  Origin: the React package 2.23.0 `aside-card.tsx`
  Diverged: `icon` is a snippet; `open` is bindable, React's `defaultOpen` its
    initial value (round 8 plan, R8-9). Lucide's chevron-down. Spreads the rest
    onto the card, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { CardProps } from '../card/card.svelte'

  /**
   * A collapsible card for a page's right-hand column.
   *
   * The column beside a form is guidance rather than input, so it folds.
   * Someone who has read the tips once should be able to put them away for the
   * rest of the flow: the answer stays available without staying in the way.
   */
  export type AsideCardProps = Omit<CardProps, 'title' | 'children'> & {
    icon: Snippet
    title: string
    /** Open to start. Collapsed suits a card that repeats on every step of a flow. */
    open?: boolean
    children: Snippet
  }
</script>

<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'

  import { cn } from '../../../utils/cn.js'
  import Button from '../../actions/button/button.svelte'
  import Card from '../card/card.svelte'
  import CardContent from '../card/card-content.svelte'
  import CardHeader from '../card/card-header.svelte'
  import CardTitle from '../card/card-title.svelte'
  import Collapsible from '../collapsible/collapsible.svelte'
  import CollapsibleContent from '../collapsible/collapsible-content.svelte'
  import CollapsibleTrigger from '../collapsible/collapsible-trigger.svelte'

  let {
    icon,
    title,
    open = $bindable(true),
    class: className,
    children,
    ...rest
  }: AsideCardProps = $props()
</script>

<Card class={cn('h-fit gap-0 py-4', className)} {...rest}>
  <Collapsible bind:open>
    <CardHeader class="flex flex-wrap items-center justify-between gap-2 px-4">
      <CardTitle class="flex items-center gap-2 text-base">
        <span class="text-muted-foreground [&_svg]:size-4">{@render icon()}</span>
        {title}
      </CardTitle>
      <CollapsibleTrigger>
        {#snippet child({ props })}
          <Button
            {...props}
            variant="ghost"
            iconOnly
            class="size-7"
            aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          >
            <ChevronDownIcon class={cn('size-4 transition-transform', open && 'rotate-180')} />
          </Button>
        {/snippet}
      </CollapsibleTrigger>
    </CardHeader>
    <CollapsibleContent>
      <CardContent class="px-4 pt-4">{@render children()}</CardContent>
    </CollapsibleContent>
  </Collapsible>
</Card>
