<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxEmpty`)
  Diverged: a plain element the caller renders when nothing matches, since the
    caller does the filtering; so it is `flex` rather than React's `hidden`
    switched on by Base UI's `data-empty`.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  export type ComboboxEmptyProps = WithElementRef<HTMLAttributes<HTMLDivElement>>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, children, ...rest }: ComboboxEmptyProps = $props()
</script>

<div
  bind:this={ref}
  data-slot="combobox-empty"
  class={cn('text-muted-foreground flex w-full justify-center py-2 text-center text-sm', className)}
  {...rest}
>
  {@render children?.()}
</div>
