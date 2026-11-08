<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogOverlay`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: none beyond the port.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'

  export type DialogOverlayProps = DialogPrimitive.OverlayProps
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let { ref = $bindable(null), class: className, ...rest }: DialogOverlayProps = $props()
</script>

<DialogPrimitive.Overlay
  bind:ref
  data-slot="dialog-overlay"
  class={cn(
    'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
    className,
  )}
  {...rest}
/>
