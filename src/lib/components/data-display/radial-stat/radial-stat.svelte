<!--
  Origin: the React package 2.23.0 `radial-stat.tsx`
  Diverged: `children` is a snippet. Takes `class` and spreads the rest onto
    the root, as every component does.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'

  /**
   * How heavy the ring is, as a fraction of its diameter. `regular` is a
   * twelfth, a ring around a figure; `thick` is a sixth, with the weight to
   * carry a card on its own. A ratio, because a fixed stroke is a hairline at
   * 140px and a solid disc at 48px.
   */
  export type RadialThickness = 'regular' | 'thick'

  const THICKNESS_DIVISOR: Record<RadialThickness, number> = { regular: 12, thick: 6 }

  /**
   * A share, drawn as an arc with the figure inside it. A circle has an obvious
   * whole, so the ring says "roughly a quarter" without the reader converting a
   * length. Right for a handful of parts side by side; wrong for a list, where
   * twenty rings are a wall of dials.
   */
  export type RadialStatProps = HTMLAttributes<HTMLDivElement> & {
    /** 0–100. Clamped: a share over 100 is a bug upstream, not a full ring plus. */
    percent: number
    tone?: Tone
    /**
     * Outer diameter in pixels; the stroke scales with it. `diameter`, not
     * `size`, which across the package means `sm | md | lg`.
     */
    diameter?: number
    /** Ring weight. `thick` for a ring that is the subject of its own card. */
    thickness?: RadialThickness
    /** Replaces the printed percentage: a count, or a short word. */
    children?: Snippet
    /** Read by assistive tech in place of the ring. */
    'aria-label'?: string
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { TONE_STROKE_CLASS } from '../../../utils/tone.js'

  let {
    percent,
    tone = 'primary',
    diameter = 72,
    thickness = 'regular',
    children,
    'aria-label': ariaLabel,
    class: className,
    ...rest
  }: RadialStatProps = $props()

  const clamped = $derived(Math.min(100, Math.max(0, percent)))
  const stroke = $derived(Math.max(4, Math.round(diameter / THICKNESS_DIVISOR[thickness])))
  const radius = $derived((diameter - stroke) / 2)
  const circumference = $derived(2 * Math.PI * radius)
  const arc = $derived(circumference * (clamped / 100))
  const centre = $derived(diameter / 2)
  /**
   * Round caps add half a stroke at each end, so on an arc shorter than the
   * stroke they overrun it and read as a marker. Below that the cap squares
   * off, and 0% draws nothing rather than a dot at twelve o'clock.
   */
  const linecap = $derived(arc >= stroke ? 'round' : 'butt')
</script>

<div
  data-slot="radial-stat"
  role="img"
  aria-label={ariaLabel ?? `${clamped.toFixed(0)} percent`}
  class={cn('relative shrink-0', className)}
  style:width="{diameter}px"
  style:height="{diameter}px"
  {...rest}
>
  <svg width={diameter} height={diameter} viewBox="0 0 {diameter} {diameter}" aria-hidden="true">
    <circle
      class="stroke-muted"
      cx={centre}
      cy={centre}
      r={radius}
      fill="none"
      stroke-width={stroke}
    />
    <circle
      class={cn('transition-[stroke-dashoffset]', TONE_STROKE_CLASS[tone])}
      cx={centre}
      cy={centre}
      r={radius}
      fill="none"
      stroke-width={stroke}
      stroke-linecap={linecap}
      stroke-dasharray={circumference}
      stroke-dashoffset={circumference - arc}
      transform="rotate(-90 {centre} {centre})"
    />
  </svg>
  <div class="absolute inset-0 grid place-items-center text-sm font-medium tabular-nums">
    {#if children}
      {@render children()}
    {:else}
      {clamped.toFixed(0)}%
    {/if}
  </div>
</div>
