<!--
  Origin: the React package 2.23.0 `command.tsx` (`CommandShortcut`), itself shadcn/ui new-york `command`
  Svelte: shadcn-svelte `command`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /** A keyboard shortcut, muted at the end of the item. */
  export type CommandShortcutProps = WithElementRef<HTMLAttributes<HTMLSpanElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: CommandShortcutProps = $props()
</script>

<span
  bind:this={ref}
  data-slot="command-shortcut"
  class={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
  {...rest}
>
  {@render children?.()}
</span>
