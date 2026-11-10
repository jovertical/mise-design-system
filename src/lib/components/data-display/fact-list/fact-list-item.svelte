<!--
  Origin: the React package 2.23.0 `fact-row.tsx` (`FactRow`)
  Diverged: one item for React's `FactRow` (horizontal) and `FactField`
    (`fact-field.tsx`, vertical), chosen by `orientation` (round 4a, R4-1).
    Both render a `div` around a `dt` and a `dd`, so the vertical form also sits
    in a `FactList`, where React's `FactField` was a bare `div`; its icon chip
    sits inside the `dt`, positioned into the row's padding, because a `dl`'s
    `div` may hold only `dt` and `dd`. `class` styles the item, as on every
    component; React's `FactRow` put `className` on the value, which is
    `valueClass` here. The value is a `value` prop in both orientations, where
    `FactField` took children.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { IconChipShape } from '../icon-chip/icon-chip-variants.js'

  /**
   * One labelled fact.
   *
   * `horizontal`, the default, puts the term left and the value right, with
   * `items-baseline justify-between` rather than a two-column grid: labels are
   * short and fixed, values long and variable, and the value must not wrap.
   * `tabular-nums` lines a column of figures up.
   *
   * `vertical` stacks the label above the value, for a narrow column where a
   * right-aligned value would truncate to nothing, or a fact with a leading
   * icon.
   */
  export type FactListItemProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    label: string | Snippet
    /** An em dash when missing: a blank cell reads as a bug, not as "none". */
    value?: string | number | Snippet | null
    orientation?: 'horizontal' | 'vertical'
    /**
     * Vertical only. An `IconChip` ahead of the fact, for one that identifies
     * (a location, a person, a category) rather than one field among several.
     */
    icon?: Snippet
    /**
     * Vertical only. `square` by default, for a column of facts under a heading;
     * `circle` for a strip of identity facts read across, where round chips
     * keep several of them from reading as a form.
     */
    iconShape?: IconChipShape
    /**
     * Vertical only. Lets the value wrap instead of truncating: a name is one
     * line, but a description is worth reading past the card edge.
     */
    multiline?: boolean
    /**
     * Classes for the value's layout: alignment, width, wrapping. A value's
     * colour comes from what it holds (a `Badge`, `Text` with a `tone`), not
     * from a class.
     */
    valueClass?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import IconChip from '../icon-chip/icon-chip.svelte'

  let {
    ref = $bindable(null),
    label,
    value,
    orientation = 'horizontal',
    icon,
    iconShape = 'square',
    multiline = false,
    valueClass,
    class: className,
    ...rest
  }: FactListItemProps = $props()

  const vertical = $derived(orientation === 'vertical')
  const withIcon = $derived(vertical && icon !== undefined)
</script>

{#snippet content(node: string | number | Snippet)}
  {#if typeof node === 'function'}
    {@render node()}
  {:else}
    {node}
  {/if}
{/snippet}

<div
  bind:this={ref}
  data-slot="fact-list-item"
  data-orientation={orientation}
  class={cn(
    vertical ? 'flex min-w-0 flex-col gap-0.5' : 'flex items-baseline justify-between gap-4',
    withIcon && 'relative min-h-8 pl-11',
    className,
  )}
  {...rest}
>
  <dt class={cn('text-muted-foreground', vertical ? 'text-xs' : 'text-sm')}>
    {#if withIcon && icon}
      <IconChip shape={iconShape} class="absolute top-0 left-0">{@render icon()}</IconChip>
    {/if}
    {@render content(label)}
  </dt>
  <dd
    class={cn(
      'text-sm font-medium',
      vertical ? (multiline ? 'min-w-0' : 'truncate') : 'text-right tabular-nums',
      valueClass,
    )}
  >
    {@render content(value ?? '—')}
  </dd>
</div>
