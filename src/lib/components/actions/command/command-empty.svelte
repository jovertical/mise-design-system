<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandEmpty`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** Shown when nothing matches what was typed. */
  export type CommandEmptyProps = CommandPrimitive.EmptyProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: CommandEmptyProps = $props()
</script>

<CommandPrimitive.Empty
  bind:ref
  data-slot="command-empty"
  class={cn('py-6 text-center text-sm', className)}
  {...rest}
/>
