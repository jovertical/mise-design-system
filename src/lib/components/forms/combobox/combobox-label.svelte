<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxLabel`)
  Diverged: bits-ui's GroupHeading for Base UI's GroupLabel.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  export type ComboboxLabelProps = ComboboxPrimitive.GroupHeadingProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: ComboboxLabelProps = $props()
</script>

<ComboboxPrimitive.GroupHeading
  bind:ref
  data-slot="combobox-label"
  class={cn(
    'text-muted-foreground px-2 py-1.5 text-xs pointer-coarse:px-3 pointer-coarse:py-2 pointer-coarse:text-sm',
    className,
  )}
  {...rest}
/>
