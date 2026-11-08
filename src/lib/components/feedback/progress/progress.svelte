<!--
  Origin: the React package 2.23.0 `progress.tsx`, itself shadcn/ui new-york `progress`
  Svelte: shadcn-svelte `progress`
  Diverged: none beyond the port. bits-ui Progress for Radix Progress; the
    indicator reads `value` against `max`, as shadcn-svelte's does, where React
    assumes a max of 100. The React divergence (`h-2` rather than `h-1.5`)
    carries over.
-->
<script lang="ts" module>
  import { Progress as ProgressPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  /**
   * The bare bar. `MetricBar` and `MetricRow` colour it through
   * `TONE_INDICATOR_CLASS`; reach for `Progress` directly when there is no label
   * or figure beside it. An unknown `value` draws an empty bar, not an animated
   * indeterminate one: the copy beside it carries "this is running".
   */
  export type ProgressProps = WithoutChildrenOrChild<ProgressPrimitive.RootProps>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...rest
  }: ProgressProps = $props()
</script>

<ProgressPrimitive.Root
  bind:ref
  data-slot="progress"
  class={cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className)}
  {value}
  {max}
  {...rest}
>
  <div
    data-slot="progress-indicator"
    class="bg-primary h-full w-full flex-1 transition-all"
    style="transform: translateX(-{100 - (100 * (value ?? 0)) / (max || 1)}%)"
  ></div>
</ProgressPrimitive.Root>
