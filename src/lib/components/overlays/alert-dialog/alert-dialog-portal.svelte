<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogPortal`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  export type AlertDialogPortalProps = AlertDialogPrimitive.PortalProps
</script>

<script lang="ts">
  let { ...rest }: AlertDialogPortalProps = $props()
</script>

<AlertDialogPrimitive.Portal {...rest} />
