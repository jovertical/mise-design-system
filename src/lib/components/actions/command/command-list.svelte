<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandList`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** The scrolling list of groups and items. */
  export type CommandListProps = CommandPrimitive.ListProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: CommandListProps = $props()
</script>

<CommandPrimitive.List
  bind:ref
  data-slot="command-list"
  class={cn('max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto', className)}
  {...rest}
/>
