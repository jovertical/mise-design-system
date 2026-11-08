<!--
  Origin: the React package 2.23.0 `tabs.tsx` (`TabsContent`), itself shadcn/ui new-york `tabs`
  Svelte: shadcn-svelte `tabs`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Tabs as TabsPrimitive } from 'bits-ui'

  export type TabsContentProps = TabsPrimitive.ContentProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: TabsContentProps = $props()
</script>

<TabsPrimitive.Content
  bind:ref
  data-slot="tabs-content"
  class={cn('flex-1 outline-none', className)}
  {...rest}
/>
