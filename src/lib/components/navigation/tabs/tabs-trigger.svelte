<!--
  Origin: the React package 2.23.0 `tabs.tsx` (`TabsTrigger`), itself shadcn/ui new-york `tabs`
  Svelte: shadcn-svelte `tabs`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Tabs as TabsPrimitive } from 'bits-ui'

  export type TabsTriggerProps = TabsPrimitive.TriggerProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import { segmentedItem } from '../../../utils/segmented-control.js'

  let { ref = $bindable(null), class: className, ...rest }: TabsTriggerProps = $props()
</script>

<TabsPrimitive.Trigger
  bind:ref
  data-slot="tabs-trigger"
  class={cn(segmentedItem, className)}
  {...rest}
/>
