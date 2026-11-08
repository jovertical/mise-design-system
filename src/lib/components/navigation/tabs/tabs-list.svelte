<!--
  Origin: the React package 2.23.0 `tabs.tsx` (`TabsList`), itself shadcn/ui new-york `tabs`
  Svelte: shadcn-svelte `tabs`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Tabs as TabsPrimitive } from 'bits-ui'

  export type TabsListProps = TabsPrimitive.ListProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { segmentedTrack } from '../../../utils/segmented-control.js'

  let { ref = $bindable(null), class: className, ...rest }: TabsListProps = $props()
</script>

<TabsPrimitive.List
  bind:ref
  data-slot="tabs-list"
  class={cn(segmentedTrack, className)}
  {...rest}
/>
