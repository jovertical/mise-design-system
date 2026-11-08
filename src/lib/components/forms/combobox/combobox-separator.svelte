<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxSeparator`)
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive, type Separator as SeparatorPrimitive } from 'bits-ui'

  export type ComboboxSeparatorProps = SeparatorPrimitive.RootProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: ComboboxSeparatorProps = $props()
</script>

<ComboboxPrimitive.Separator
  bind:ref
  data-slot="combobox-separator"
  class={cn('bg-border -mx-1 my-1 h-px', className)}
  {...rest}
/>
