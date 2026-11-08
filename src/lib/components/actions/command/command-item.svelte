<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandItem`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk. bits-ui marks the highlighted and disabled items with empty `data-selected` and `data-disabled` attributes, where cmdk set them to `"true"`.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** One command. The highlighted row takes the muted wash, as a menu row does. */
  export type CommandItemProps = CommandPrimitive.ItemProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: CommandItemProps = $props()
</script>

<CommandPrimitive.Item
  bind:ref
  data-slot="command-item"
  class={cn(
    "data-selected:bg-muted data-selected:text-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex min-h-7 cursor-default items-center gap-2 rounded-xl px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-2xl data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    className,
  )}
  {...rest}
/>
