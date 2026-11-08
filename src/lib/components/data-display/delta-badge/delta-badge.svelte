<!--
  Origin: the React package 2.23.0 `delta-badge.tsx`
  Diverged: Lucide's trending-up, trending-down and minus for Tabler's. Takes
    `class` and spreads the rest onto the root, as every component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  /**
   * A period-over-period change, as a tinted pill.
   *
   * Colour reads the sign, not the metric: up is green and down is red unless
   * `invert` says falling is the point. Most figures on a dashboard are things
   * you want more of, so the exceptions are marked one by one. A delta of
   * exactly zero renders flat and muted: a dashboard of green pills where
   * nothing moved teaches an operator to stop reading them.
   *
   * It carries no label. What changed is the tile it sits in.
   */
  export type DeltaBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    /** The change, signed. `2.4` renders `+2.4%`, `-2.4` renders `-2.4%`. */
    value: number
    /** Appended to the number. `%` for a rate, `x` for a multiple. */
    unit?: string
    /**
     * Ahead of the number, after the sign: `$` renders `+$1.25`. Pass `unit=""`
     * with it, or the `%` default trails the figure.
     */
    prefix?: string
    /** Decimal places. A delta is a direction, not a measurement; one is usually right. */
    precision?: number
    /**
     * Set when falling is the good outcome: failed payments, time to fulfil,
     * stock at risk. The arrow still follows the sign; only the colour flips.
     */
    invert?: boolean
    /**
     * `pill`, the default, is a tinted, self-contained badge, for beside a bare
     * figure. `plain` drops the fill and padding, for inline in a muted sentence
     * where a pill would compete with the text sharing its line.
     */
    variant?: 'pill' | 'plain'
  }
</script>

<script lang="ts">
  import MinusIcon from '@lucide/svelte/icons/minus'
  import TrendingDownIcon from '@lucide/svelte/icons/trending-down'
  import TrendingUpIcon from '@lucide/svelte/icons/trending-up'

  import { cn } from '../../../utils/cn.js'
  import { TONE_SOFT_CLASS, TONE_TEXT_CLASS, type Tone } from '../../../utils/tone.js'

  let {
    value,
    unit = '%',
    prefix = '',
    precision = 1,
    invert = false,
    variant = 'pill',
    class: className,
    ...rest
  }: DeltaBadgeProps = $props()

  const rising = $derived(value > 0)
  const flat = $derived(value === 0)
  const tone: Tone = $derived(flat ? 'neutral' : rising !== invert ? 'success' : 'critical')
  const Icon = $derived(flat ? MinusIcon : rising ? TrendingUpIcon : TrendingDownIcon)
  const sign = $derived(rising ? '+' : value < 0 ? '-' : '')
</script>

<span
  data-slot="delta-badge"
  class={cn(
    'inline-flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums',
    variant === 'pill'
      ? cn('rounded-full px-2 py-0.5', TONE_SOFT_CLASS[tone])
      : tone === 'neutral'
        ? 'text-muted-foreground'
        : TONE_TEXT_CLASS[tone],
    className,
  )}
  {...rest}
>
  <Icon class="size-3.5" />
  {sign}{prefix}{Math.abs(value).toFixed(precision)}{unit}
</span>
