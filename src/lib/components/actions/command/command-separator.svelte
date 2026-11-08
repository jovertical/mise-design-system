<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandSeparator`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** A rule between groups. */
  export type CommandSeparatorProps = CommandPrimitive.SeparatorProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: CommandSeparatorProps = $props()
</script>

<CommandPrimitive.Separator
  bind:ref
  data-slot="command-separator"
  class={cn('bg-border -mx-1 h-px', className)}
  {...rest}
/>
