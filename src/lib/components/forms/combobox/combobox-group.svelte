<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxGroup`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  export type ComboboxGroupProps = ComboboxPrimitive.GroupProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: ComboboxGroupProps = $props()
</script>

<ComboboxPrimitive.Group bind:ref data-slot="combobox-group" {...rest} />
