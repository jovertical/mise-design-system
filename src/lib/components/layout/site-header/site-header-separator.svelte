<!--
  Origin: mise
  Diverged: none. A short vertical divider between the groups in a
    SiteHeader, where a full-height rule would touch the bar's edges.
-->
<script lang="ts" module>
  import type { SeparatorProps } from '../separator/separator.svelte'

  /** `Separator`, vertical and 16px tall, with the bar's spacing either side. */
  export type SiteHeaderSeparatorProps = Omit<SeparatorProps, 'orientation'>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Separator from '../separator/separator.svelte'

  let { ref = $bindable(null), class: className, ...rest }: SiteHeaderSeparatorProps = $props()
</script>

<Separator
  bind:ref
  orientation="vertical"
  data-slot="site-header-separator"
  class={cn('mx-1 h-4 self-center', className)}
  {...rest}
/>
