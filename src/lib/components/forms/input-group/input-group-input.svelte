<!--
  Origin: the React package 2.23.0 `input-group.tsx` (`InputGroupInput`), itself shadcn/ui new-york `input-group`
  Svelte: shadcn-svelte `input-group`
  Diverged: none beyond the port. `bind:value` passes through to Input.
-->
<script lang="ts" module>
  import type { InputProps } from '../input/input.svelte'

  export type InputGroupInputProps = InputProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Input from '../input/input.svelte'

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...rest
  }: InputGroupInputProps = $props()
</script>

<Input
  bind:ref
  bind:value
  data-slot="input-group-control"
  class={cn(
    'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
    className,
  )}
  {...rest}
/>
