<!--
  Origin: the React package 2.23.0 `command.tsx` (`Command`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /**
   * A filterable, keyboard-navigable list, grouped by section: the shape a
   * command palette is built on. Bare for an inline picker; `CommandDialog`
   * puts it in a dialog.
   */
  export type CommandProps = CommandPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...rest
  }: CommandProps = $props()
</script>

<CommandPrimitive.Root
  bind:ref
  bind:value
  data-slot="command"
  class={cn(
    'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-2xl',
    className,
  )}
  {...rest}
/>
