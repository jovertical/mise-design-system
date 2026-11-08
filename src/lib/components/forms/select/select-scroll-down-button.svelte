<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectScrollDownButton`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export type SelectScrollDownButtonProps =
    WithoutChildrenOrChild<SelectPrimitive.ScrollDownButtonProps>
</script>

<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down'

  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SelectScrollDownButtonProps = $props()
</script>

<SelectPrimitive.ScrollDownButton
  bind:ref
  data-slot="select-scroll-down-button"
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  {...rest}
>
  <ChevronDownIcon class="size-4" />
</SelectPrimitive.ScrollDownButton>
