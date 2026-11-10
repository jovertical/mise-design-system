<!--
  Origin: the React package 2.23.0 `stat-tile.tsx`
  Diverged: the rows are a `FactList` of `FactListItem`s, each ruled by a top
    border, where React put a `Separator` and a `FactRow` together in a `div`
    inside the `dl`, which a `dl` does not allow. The rule sits in the same
    places: above the first row and between rows, never below the last. `icon`,
    `hint`, `delta`, `action`, `visual` and `footer` are snippets, and `value`,
    `unit`, `description` and a row's `label` and `value` take a string or a
    snippet, as R4-5 has a ReactNode prop. Takes `class` and spreads the rest
    onto the root, as every component does. The size maps and row type are
    in `stat-tile-variants.ts`, the label and figure in
    `stat-tile-headline.svelte`.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'
  import type { IconChipShape } from '../icon-chip/icon-chip-variants.js'
  import type {
    StatIconAlignment,
    StatIconSize,
    StatRow,
    StatSize,
    StatSurface,
  } from './stat-tile-variants.js'

  /**
   * The dashboard's headline number. One tile states one figure, and the rest
   * qualifies it: a unit, a delta, a description, a sparkline, a few rows. The
   * icon sits in a chip so the eye lands on the number, and colour is kept for
   * tone; a tile merely reporting a total stays in ink.
   *
   * Loading and error are the tile's business. An error renders the em dash a
   * missing value does, and the tile keeps its height either way: a row of four
   * where one has collapsed is worse than one where a tile has no answer.
   */
  export type StatTileProps = HTMLAttributes<HTMLDivElement> & {
    /** A short caption above the figure. */
    label: string
    /**
     * The figure, already formatted: the package has no opinion about
     * currencies or locales. `null` renders an em dash.
     */
    value: string | number | Snippet | null
    /**
     * What the figure is counted in: `orders`, `per order`. Its own small line
     * under the figure, since beside it a delta and a visual made every tile in
     * a row wrap at a different point.
     */
    unit?: string | Snippet
    /** The unabbreviated figure, on hover: `$45,612.40` under `$45.6k`. */
    exactValue?: string
    icon?: Snippet
    /** An explanation trigger after the label; it belongs to the caption it explains. */
    hint?: Snippet
    /**
     * Colours the figure only, never the chip or the card: "this figure has a
     * direction", not "this is a problem".
     */
    tone?: Tone
    size?: StatSize
    surface?: StatSurface
    /**
     * `square` by default. A chip holding a face or initials is a circle; for
     * icon chips the screen picks, and every chip in the row takes the same one.
     */
    iconShape?: IconChipShape
    /** A muted line under the figure. */
    description?: string | Snippet
    /**
     * After the figure, on its line: a `DeltaBadge`, so `$45.6k ↗ +15.7%` reads
     * as one statement. Dropped on error.
     */
    delta?: Snippet
    /**
     * Top right, on the label's line: a link out to what the figure summarises.
     * Keep it short; the label is the one that wraps.
     */
    action?: Snippet
    /**
     * A shape beside the figure, a `Sparkline` usually. It takes half the row
     * and yields: a long figure squeezes the shape, never the reverse.
     */
    visual?: Snippet
    /** Supporting facts under the figure, ruled off from it and from each other. */
    rows?: StatRow[]
    /** Below everything else: a bar, a total. */
    footer?: Snippet
    /**
     * Right by default: the icon is ornament, so label, figure and description
     * run straight down the left edge. Left for an icon that carries meaning.
     */
    iconPosition?: 'left' | 'right'
    iconAlignment?: StatIconAlignment
    iconTone?: Tone
    iconSize?: StatIconSize
    /**
     * Lets the chip follow `tone`, so one threshold colours both and the two
     * cannot drift into an ink figure in a red chip. Off by default: a tinted
     * chip beside a tinted figure says the same thing twice. Supersedes
     * `iconTone`.
     */
    applyToneToIcon?: boolean
    loading?: boolean
    error?: boolean
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_TEXT_CLASS } from '../../../utils/tone.js'
  import Skeleton from '../../feedback/skeleton/skeleton.svelte'
  import Card from '../../layout/card/card.svelte'
  import FactList from '../fact-list/fact-list.svelte'
  import FactListItem from '../fact-list/fact-list-item.svelte'
  import IconChip from '../icon-chip/icon-chip.svelte'
  import StatTileHeadline from './stat-tile-headline.svelte'
  import { ICON_CHIP_SIZE, ICON_ROW_ALIGN_CLASS } from './stat-tile-variants.js'

  let {
    label,
    value,
    unit,
    exactValue,
    icon,
    hint,
    tone = 'neutral',
    size = 'md',
    surface = 'card',
    iconPosition = 'right',
    iconAlignment = 'center',
    iconTone = 'neutral',
    iconSize,
    iconShape = 'square',
    applyToneToIcon = false,
    description,
    delta,
    action,
    visual,
    rows,
    footer,
    loading = false,
    error = false,
    class: className,
    ...rest
  }: StatTileProps = $props()

  const inset = $derived(surface === 'inset')
  const hasValue = $derived(!error && value !== null && value !== undefined)
  const chipTone = $derived(applyToneToIcon ? tone : iconTone)
  const padded = $derived(inset ? '' : 'px-(--card-spacing)')
</script>

{#snippet content(node: string | number | Snippet)}
  {#if typeof node === 'function'}
    {@render node()}
  {:else}
    {node}
  {/if}
{/snippet}

{#snippet chip()}
  {#if icon}
    <IconChip size={ICON_CHIP_SIZE[iconSize ?? size]} shape={iconShape} tone={chipTone}>
      {@render icon()}
    </IconChip>
  {/if}
{/snippet}

{#snippet body()}
  <div class={cn('flex gap-4', ICON_ROW_ALIGN_CLASS[iconAlignment], padded)}>
    {#if iconPosition === 'left'}
      {@render chip()}
    {/if}

    <StatTileHeadline
      {label}
      {value}
      {unit}
      {exactValue}
      {hint}
      {tone}
      {size}
      {delta}
      {action}
      {visual}
      {inset}
      {hasValue}
      {loading}
      {error}
      {content}
    />

    {#if iconPosition === 'right'}
      {@render chip()}
    {/if}
  </div>

  {#if description}
    <div class={cn('text-muted-foreground mt-1 text-xs', padded)}>
      {#if loading}
        <Skeleton class="h-4 w-40" />
      {:else}
        {@render content(description)}
      {/if}
    </div>
  {/if}

  {#if rows && rows.length > 0}
    <!-- Ruled above the first row and between rows, never below the last. -->
    <FactList class={cn('mt-4 gap-3', padded)}>
      {#each rows as row (row.id)}
        <FactListItem
          class="border-t pt-3"
          label={row.label}
          value={error ? null : row.value}
          valueClass={error ? undefined : TONE_TEXT_CLASS[row.tone ?? 'neutral']}
        />
      {/each}
    </FactList>
  {/if}

  {#if footer}
    <div class={cn('mt-3', padded)}>{@render footer()}</div>
  {/if}
{/snippet}

{#if inset}
  <div
    data-slot="stat-tile"
    class={cn('bg-muted/40 flex flex-col rounded-xl border p-4', className)}
    {...rest}
  >
    {@render body()}
  </div>
{:else}
  <!--
    `shadow-md` lifts the tile a step above `Card`'s default: a dashboard's tiles
    are the one surface meant to sit above the page.
  -->
  <Card data-stat-tile="" class={cn('gap-0 shadow-md', className)} {...rest}>
    {@render body()}
  </Card>
{/if}
