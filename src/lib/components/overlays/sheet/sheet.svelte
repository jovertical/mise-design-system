<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`Sheet`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package. bits-ui Dialog for Radix Dialog, with `bind:open`.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'

  /**
   * A panel anchored to the viewport's edge, `side="right"` by default: the
   * desktop side panel for a quick view without leaving the list.
   */
  export type SheetProps = SheetPrimitive.RootProps
</script>

<script lang="ts">
  let { open = $bindable(false), ...rest }: SheetProps = $props()
</script>

<SheetPrimitive.Root bind:open {...rest} />
