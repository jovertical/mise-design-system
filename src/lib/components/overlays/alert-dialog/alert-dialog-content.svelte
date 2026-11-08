<!--
  Origin: the React package 2.23.0 `alert-dialog.tsx` (`AlertDialogContent`), itself shadcn/ui new-york `alert-dialog`
  Svelte: shadcn-svelte `alert-dialog`
  Diverged: `portalProps` added for the bits-ui Portal, as on DialogContent.
-->
<script lang="ts" module>
  import { AlertDialog as AlertDialogPrimitive } from 'bits-ui'

  /**
   * The card's 24px radius, a ring and `shadow-xl`: it is a dialog, and was
   * drawn like a menu. `size="sm"` for a short confirmation with no description.
   */
  export type AlertDialogContentProps = AlertDialogPrimitive.ContentProps & {
    size?: 'default' | 'sm'
    portalProps?: AlertDialogPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import AlertDialogOverlay from './alert-dialog-overlay.svelte'
  import AlertDialogPortal from './alert-dialog-portal.svelte'

  let {
    ref = $bindable(null),
    size = 'default',
    portalProps,
    class: className,
    ...rest
  }: AlertDialogContentProps = $props()
</script>

<AlertDialogPortal {...portalProps}>
  <AlertDialogOverlay />
  <AlertDialogPrimitive.Content
    bind:ref
    data-slot="alert-dialog-content"
    data-size={size}
    class={cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[min(var(--radius-4xl),24px)] ring-1 ring-foreground/5 dark:ring-foreground/10 p-6 shadow-xl duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg',
      className,
    )}
    {...rest}
  />
</AlertDialogPortal>
