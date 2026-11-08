<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectGroup`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  export type SelectGroupProps = SelectPrimitive.GroupProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: SelectGroupProps = $props()
</script>

<SelectPrimitive.Group bind:ref data-slot="select-group" {...rest} />
