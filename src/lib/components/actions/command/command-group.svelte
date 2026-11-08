<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandGroup`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk. The heading is a `heading` prop drawn as bits-ui's `GroupHeading`, where cmdk styled a `[cmdk-group-heading]` attribute; the classes are React's.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** A section of items, under a small muted heading. */
  export type CommandGroupProps = CommandPrimitive.GroupProps & { heading?: string }
</script>

<script lang="ts">
  import { useId } from 'bits-ui'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    heading,
    value,
    class: className,
    children,
    ...rest
  }: CommandGroupProps = $props()

  const fallbackValue = `----${useId()}`
</script>

<CommandPrimitive.Group
  bind:ref
  data-slot="command-group"
  value={value ?? heading ?? fallbackValue}
  class={cn('text-foreground overflow-hidden p-1', className)}
  {...rest}
>
  {#if heading}
    <CommandPrimitive.GroupHeading class="text-muted-foreground px-2 py-1.5 text-xs font-medium">
      {heading}
    </CommandPrimitive.GroupHeading>
  {/if}
  <CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
