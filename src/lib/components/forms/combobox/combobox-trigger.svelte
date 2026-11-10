<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxTrigger`)
  Diverged: none.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  /** The chevron that opens the list without typing. ComboboxInput draws its own. */
  export type ComboboxTriggerProps = ComboboxPrimitive.TriggerProps
</script>

<script lang="ts">
  import IconChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...rest
  }: ComboboxTriggerProps = $props()
</script>

<ComboboxPrimitive.Trigger
  bind:ref
  data-slot="combobox-trigger"
  class={cn("[&_svg:not([class*='size-'])]:size-4", className)}
  {...rest}
>
  {@render children?.()}
  <IconChevronDown
    data-slot="combobox-trigger-icon"
    class="text-muted-foreground pointer-events-none size-4"
  />
</ComboboxPrimitive.Trigger>
