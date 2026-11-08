<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxList`)
  Diverged: bits-ui's Viewport, which takes the list's place and its scroll;
    the height cap reads `--bits-combobox-content-available-height`. Children
    are the items, rendered by the caller, not a render function.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  export type ComboboxListProps = ComboboxPrimitive.ViewportProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: ComboboxListProps = $props()
</script>

<ComboboxPrimitive.Viewport
  bind:ref
  data-slot="combobox-list"
  class={cn(
    'max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--bits-combobox-content-available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 empty:p-0',
    className,
  )}
  {...rest}
/>
