<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetClose`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package. `asChild` is bits-ui's `child` snippet.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'

  export type SheetCloseProps = SheetPrimitive.CloseProps
</script>

<script lang="ts">
  let { ref = $bindable(null), ...rest }: SheetCloseProps = $props()
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" {...rest} />
