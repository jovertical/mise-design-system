<!--
  Origin: the React package 2.23.0 `tabs.tsx` (`Tabs`), itself shadcn/ui new-york `tabs`
  Svelte: shadcn-svelte `tabs`
  Diverged: bits-ui Tabs for Radix Tabs, with `bind:value`. The track and
    trigger classes live in utils/segmented-control.ts, shared with ToggleGroup.
-->
<script lang="ts" module>
  import { Tabs as TabsPrimitive } from 'bits-ui'

  export type TabsProps = TabsPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...rest
  }: TabsProps = $props()
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value
  data-slot="tabs"
  class={cn('flex flex-col gap-2', className)}
  {...rest}
/>
