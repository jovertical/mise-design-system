<!--
  Origin: the React package 2.23.0 `timeline.tsx` (`TimelineConnector`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * The rule under a badge. Rendered by every item except the last. `min-h-6`
   * keeps a visible run of line under a one-line body, so a short entry does
   * not collapse the badge spacing.
   */
  export type TimelineConnectorProps = WithElementRef<HTMLAttributes<HTMLHRElement>, HTMLHRElement>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: TimelineConnectorProps = $props()
</script>

<hr
  bind:this={ref}
  data-slot="timeline-connector"
  aria-orientation="vertical"
  class={cn(
    'bg-border col-start-2 col-end-3 row-start-2 row-end-2 mx-auto h-full min-h-6 w-0.5 rounded-full border-0',
    className,
  )}
  {...rest}
>
