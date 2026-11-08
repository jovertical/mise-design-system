<!--
  Origin: the React package 2.23.0 `switch.tsx`, itself shadcn/ui new-york `switch`
  Svelte: shadcn-svelte `switch`
  Diverged: unaudited, as in the React package. bits-ui Switch for Radix Switch,
    with `bind:checked`.
-->
<script lang="ts" module>
  import { Switch as SwitchPrimitive } from 'bits-ui'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  /** Bare: pair it with a Label, or a field, when it needs words beside it. */
  export type SwitchProps = WithoutChildrenOrChild<SwitchPrimitive.RootProps>
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    class: className,
    ...rest
  }: SwitchProps = $props()
</script>

<SwitchPrimitive.Root
  bind:ref
  bind:checked
  data-slot="switch"
  class={cn(
    'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    className,
  )}
  {...rest}
>
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    class="bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
  />
</SwitchPrimitive.Root>
