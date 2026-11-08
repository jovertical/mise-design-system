<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxChipsInput`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  /** The text a multiple combobox is typed into, inside `ComboboxChips`. */
  export type ComboboxChipsInputProps = ComboboxPrimitive.InputProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: ComboboxChipsInputProps = $props()
</script>

<ComboboxPrimitive.Input
  bind:ref
  data-slot="combobox-chip-input"
  class={cn('min-w-16 flex-1 bg-transparent outline-none', className)}
  {...rest}
/>
