<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetTrigger`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package. `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'

  export type SheetTriggerProps = SheetPrimitive.TriggerProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: SheetTriggerProps = $props()
</script>

<SheetPrimitive.Trigger bind:ref data-slot="sheet-trigger" {...rest} />
