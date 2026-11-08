<!--
  Origin: the React package 2.23.0 `dropdown-menu.tsx` (`DropdownMenuRadioGroup`), itself shadcn/ui new-york `dropdown-menu`
  Svelte: shadcn-svelte `dropdown-menu`
  Diverged: none beyond the port. `value` is bindable.
-->
<script lang="ts" module>
  import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

  export type DropdownMenuRadioGroupProps = DropdownMenuPrimitive.RadioGroupProps
</script>

<script lang="ts">
  let {
    ref = $bindable(null),
    value = $bindable(''),
    ...rest
  }: DropdownMenuRadioGroupProps = $props()
</script>

<DropdownMenuPrimitive.RadioGroup
  bind:ref
  bind:value
  data-slot="dropdown-menu-radio-group"
  {...rest}
/>
