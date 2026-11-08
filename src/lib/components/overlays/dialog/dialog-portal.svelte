<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogPortal`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: bits-ui Portal for Radix Portal.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogPortalProps = DialogPrimitive.PortalProps
</script>

<script lang="ts">
  let { ...rest }: DialogPortalProps = $props()
</script>

<DialogPrimitive.Portal {...rest} />
