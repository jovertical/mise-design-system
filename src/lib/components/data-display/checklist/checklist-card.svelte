<!--
  Origin: the React package 2.23.0 `checklist-card.tsx`
  Diverged: one of the checklist family (round 8 plan, R8-4), its rows drawn by
    the family's shared row heading. `action`, `footer`, `collapsedControl` and
    each item's `action` are snippets. Spreads the rest onto the card, as every
    component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { CardProps } from '../../layout/card/card.svelte'
  import type { ChecklistCardItem } from './checklist-types.js'

  /**
   * A progress card small enough to live above a sidebar's nav: a ring, a
   * heading, and the next few unmet rows.
   *
   * Not `ReadinessChecklist`, which answers "what does this page still need
   * from me" and tags rows Required in warning colour. This answers "what is
   * worth doing next", where an untouched row is not a problem.
   *
   * The ring is `success` at the end and `primary` before it, and that is not
   * a prop: a setup checklist has one finish line.
   */
  export type ChecklistCardProps = Omit<CardProps, 'title' | 'children' | 'variant'> & {
    title: string
    /**
     * 0–100, clamped, rounded for the figure only. Not derived from `items`:
     * the card shows the next few rows and the ring counts all of them.
     */
    percent: number
    items: ChecklistCardItem[]
    /**
     * The sidebar's icon-rail mode: no card, just a solid icon button at a nav
     * icon's width, with the share in its accessible name.
     */
    collapsed?: boolean
    /** Replaces the collapsed button, so it can match the caller's own nav buttons. */
    collapsedControl?: Snippet
    /**
     * `md` for a card on its own; `sm` for one pinned above a sidebar's nav.
     * `sm` scales the ring, the title, the rows and the card's padding together.
     */
    size?: 'sm' | 'md'
    /**
     * `outline` drops the fill and the shadow for a visible ring: on a dark
     * sidebar a dark fill barely reads as a card, and a border separates it.
     */
    variant?: 'default' | 'outline'
    /** The header's corner: a "Hide" button. */
    action?: Snippet
    /** The way to the full list: "See all steps". */
    footer?: Snippet
  }
</script>

<script lang="ts">
  import IconChecklist from '@tabler/icons-svelte-runes/icons/checklist'

  import { cn } from '../../../utils/cn.js'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardFooter from '../../layout/card/card-footer.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import CardList from '../../layout/card-list/card-list.svelte'
  import RadialStat from '../radial-stat/radial-stat.svelte'
  import ChecklistRowHeading from './checklist-row-heading.svelte'

  let {
    title,
    percent,
    items,
    collapsed = false,
    collapsedControl,
    size = 'md',
    variant = 'default',
    action,
    footer,
    class: className,
    ...rest
  }: ChecklistCardProps = $props()

  const bounded = $derived(Math.min(100, Math.max(0, percent)))
  // Rounded for the figure only: 99.6% reads 100% while the ring keeps its gap
  // and its unfinished colour.
  const shown = $derived(Math.round(bounded))
  const tone = $derived(bounded >= 100 ? 'success' : 'primary')
  // Collapsed, the name carries the title; expanded, CardTitle is beside it.
  const ringLabel = $derived(collapsed ? `${title}: ${shown}% complete` : `${shown}% complete`)
  const small = $derived(size === 'sm')
</script>

{#if collapsed}
  <div data-slot="checklist-card" class={cn('flex justify-center', className)}>
    {#if collapsedControl}
      {@render collapsedControl()}
    {:else}
      <!-- A solid icon rather than the bare ring: at 0% the ring is an empty
           track, which reads as nothing against a dark rail. -->
      <div
        role="img"
        aria-label={ringLabel}
        class="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-md"
      >
        <IconChecklist aria-hidden="true" class="size-6" />
      </div>
    {/if}
  </div>
{:else}
  <Card
    class={cn(
      // `sm` tightens --card-spacing itself, so every Card part follows it.
      small && '[--card-spacing:--spacing(3)]',
      // ring-border rather than Card's hairline, which reads as nothing once
      // the fill it separated from is gone too.
      variant === 'outline' && 'bg-transparent shadow-none ring-1 ring-border',
      className,
    )}
    {...rest}
  >
    <CardHeader class="flex items-center gap-3">
      <RadialStat percent={bounded} {tone} diameter={small ? 40 : 48} aria-label={ringLabel} />
      <CardTitle class={cn('flex-1', small && 'text-sm')}>{title}</CardTitle>
      {@render action?.()}
    </CardHeader>

    {#if items.length > 0}
      <CardContent>
        <!-- biome-ignore lint/a11y/useSemanticElements: CardList is a div, so full-bleed rules can cancel the card padding; a ul or li there would take the rules off the edges, and role list/listitem is the ARIA equivalent -->
        <CardList compact role="list" class={small ? '[&>*]:py-2' : undefined}>
          {#each items as item (item.id)}
            <!-- biome-ignore lint/a11y/useSemanticElements: CardList is a div, so full-bleed rules can cancel the card padding; a ul or li there would take the rules off the edges, and role list/listitem is the ARIA equivalent -->
            <div
              data-slot="checklist-card-item"
              role="listitem"
              class={cn('flex items-center gap-2', small ? 'text-xs' : 'text-sm')}
            >
              <ChecklistRowHeading
                state={item.done ? 'completed' : 'pending'}
                label={item.label}
                {size}
              />
              {#if item.action}
                <div class="shrink-0 text-xs">{@render item.action()}</div>
              {/if}
            </div>
          {/each}
        </CardList>
      </CardContent>
    {/if}

    {#if footer}
      <CardFooter divided class={cn(small && 'text-xs')}>{@render footer()}</CardFooter>
    {/if}
  </Card>
{/if}
