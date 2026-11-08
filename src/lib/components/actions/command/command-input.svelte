<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandInput`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: bits-ui Command for cmdk.
-->
<script lang="ts" module>
  import { Command as CommandPrimitive } from 'bits-ui'

  /** The search field, with its glyph, ruled off from the list below. */
  export type CommandInputProps = CommandPrimitive.InputProps
</script>

<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    value = $bindable(''),
    class: className,
    ...rest
  }: CommandInputProps = $props()
</script>

<div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
  <SearchIcon class="size-4 shrink-0 opacity-50" />
  <CommandPrimitive.Input
    bind:ref
    bind:value
    data-slot="command-input"
    class={cn(
      'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...rest}
  />
</div>
