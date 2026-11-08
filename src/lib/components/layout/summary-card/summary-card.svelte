<!--
  Origin: the React package 2.23.0 `summary-card.tsx`
  Diverged: React's SectionTitle is CardTitle's `icon`, as the structure spec
    folded it. `icon` and `action` are snippets. Spreads the rest onto the card,
    as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { CardProps } from '../card/card.svelte'

  /**
   * A read-only account of what one step produced.
   *
   * Read-only is the whole idea. Every field shown here is owned by somewhere
   * else (an earlier step of a builder, or a server that has already acted),
   * and editing in two places is how the two drift apart. Whatever way back
   * exists goes in `action` and nowhere else.
   *
   * `h-full`, so a row of these lines up when one card has more fields than
   * its neighbours.
   */
  export type SummaryCardProps = Omit<CardProps, 'title' | 'children'> & {
    icon: Snippet
    title: string
    /** The way back to where these fields are edited, if there is one. */
    action?: Snippet
    children: Snippet
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Card from '../card/card.svelte'
  import CardAction from '../card/card-action.svelte'
  import CardContent from '../card/card-content.svelte'
  import CardHeader from '../card/card-header.svelte'
  import CardTitle from '../card/card-title.svelte'

  let { icon, title, action, class: className, children, ...rest }: SummaryCardProps = $props()
</script>

<Card class={cn('h-full gap-4', className)} {...rest}>
  <CardHeader>
    <CardTitle {icon}>{title}</CardTitle>
    {#if action}
      <CardAction>{@render action()}</CardAction>
    {/if}
  </CardHeader>
  <CardContent stack="sm">{@render children()}</CardContent>
</Card>
