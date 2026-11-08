<!--
  Origin: the React package 2.23.0 `select.tsx` (`SelectValue`), itself shadcn/ui new-york `select`
  Svelte: shadcn-svelte `select`
  Diverged: bits-ui renders the selected item's `label`, where Radix rendered its ItemText.
-->
<script lang="ts" module>
  import { Select as SelectPrimitive } from 'bits-ui'

  export type SelectValueProps = SelectPrimitive.ValueProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: SelectValueProps = $props()
</script>

<SelectPrimitive.Value bind:ref data-slot="select-value" {...rest} />
