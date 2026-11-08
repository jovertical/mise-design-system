<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectScrollUpButton`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export type SelectScrollUpButtonProps =
    WithoutChildrenOrChild<SelectPrimitive.ScrollUpButtonProps>
</script>

<script lang="ts">
  import ChevronUpIcon from '@lucide/svelte/icons/chevron-up'

  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: SelectScrollUpButtonProps = $props()
</script>

<SelectPrimitive.ScrollUpButton
  bind:ref
  data-slot="select-scroll-up-button"
  class={cn('flex cursor-default items-center justify-center py-1', className)}
  {...rest}
>
  <ChevronUpIcon class="size-4" />
</SelectPrimitive.ScrollUpButton>
