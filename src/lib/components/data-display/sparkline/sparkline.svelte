<!--
  Origin: the React package 2.23.0 `sparkline.tsx`
  Diverged: plain SVG rather than recharts (round 4a, R4-3). The curve is the
    same monotone one, from `utils/monotone-path.ts`, drawn into a stretched
    `viewBox` with a non-scaling stroke. Takes `class` and spreads the rest onto
    the root, as every component does.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { Tone } from '../../../utils/tone.js'

  /**
   * A figure's recent shape, drawn small enough to sit beside it. No axes, no
   * grid, no tooltip, no labels: it answers "is that number climbing or
   * falling" in the space of a word. Anything that invites closer reading
   * belongs in a chart on its own card.
   *
   * The tone is the series' identity, not a verdict on its direction.
   */
  export type SparklineProps = HTMLAttributes<HTMLDivElement> & {
    /** The series, oldest first. Fewer than two points draws nothing. */
    data: number[]
    tone?: Tone
    /** Height in pixels. The width comes from whatever holds it. */
    height?: number
    /** Read by assistive tech: the shape says nothing without it. */
    'aria-label'?: string
  }

  /** The viewBox is 100 units each way, stretched to whatever box holds it. */
  const SIZE = 100

  /**
   * One id per instance. The gradient lives in `defs`, and two sparklines
   * sharing an id would paint the second with the first's colour.
   */
  let instances = 0
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { monotonePath } from '../../../utils/monotone-path.js'
  import { TONE_CSS_VAR } from '../../../utils/tone.js'

  let { data, tone = 'primary', height = 40, class: className, ...rest }: SparklineProps = $props()

  const gradientId = `sparkline-${++instances}`

  const colour = $derived(TONE_CSS_VAR[tone])

  /** 2px of room above and below, so the stroke is not clipped at an extreme. */
  const points = $derived.by(() => {
    const margin = (2 / height) * SIZE
    const low = Math.min(...data)
    const range = Math.max(...data) - low

    return data.map((value, index): [number, number] => [
      (index / (data.length - 1)) * SIZE,
      range === 0 ? SIZE / 2 : SIZE - margin - ((value - low) / range) * (SIZE - 2 * margin),
    ])
  })

  const line = $derived(monotonePath(points))
  const area = $derived(`${line}L${SIZE},${SIZE}L0,${SIZE}Z`)
</script>

{#if data.length >= 2}
  <div data-slot="sparkline" role="img" class={cn(className)} style:height="{height}px" {...rest}>
    <svg
      viewBox="0 0 {SIZE} {SIZE}"
      preserveAspectRatio="none"
      class="block size-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <!--
          A gradient, where a full-size chart uses a flat wash: at 40px a flat
          fill reads as a solid block with a bumpy top, and the fade keeps the
          line legible as the line.
        -->
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color={colour} stop-opacity="0.35" />
          <stop offset="100%" stop-color={colour} stop-opacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#{gradientId})" />
      <path
        d={line}
        fill="none"
        stroke={colour}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  </div>
{/if}
