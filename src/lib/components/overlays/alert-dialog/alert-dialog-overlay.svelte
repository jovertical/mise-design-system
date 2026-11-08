<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogOverlay`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  export type AlertDialogOverlayProps = AlertDialogPrimitive.OverlayProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: AlertDialogOverlayProps = $props()
</script>

<AlertDialogPrimitive.Overlay
  bind:ref
  data-slot="alert-dialog-overlay"
  class={cn(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
    className,
  )}
  {...rest}
/>
