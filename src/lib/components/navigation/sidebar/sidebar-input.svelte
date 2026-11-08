<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarInput`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import type { InputProps } from '../../forms/input/input.svelte'

  export type SidebarInputProps = InputProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Input from '../../forms/input/input.svelte'

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...rest
  }: SidebarInputProps = $props()
</script>

<Input
  bind:ref
  bind:value
  data-slot="sidebar-input"
  data-sidebar="input"
  class={cn('bg-background h-8 w-full shadow-none', className)}
  {...rest}
/>
