<!--
  Origin: the React package 2.23.0 `dialog.tsx` (`DialogContent`), itself shadcn/ui new-york `dialog`
  Svelte: shadcn-svelte `dialog`
  Diverged: `portalProps` added for the bits-ui Portal, as shadcn-svelte has it.
    The close button keeps the React classes rather than shadcn-svelte's ghost Button.
-->
<script lang="ts" module>
  import { Dialog as DialogPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export const DIALOG_SIZE_CLASS = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
  } as const

  export type DialogSize = keyof typeof DIALOG_SIZE_CLASS

  /**
   * A ring rather than a border, and `shadow-xl` rather than `shadow-lg`: a
   * dialog sits above everything, so it casts the deeper shadow.
   *
   * `size` names four widths rather than each dialog carrying its own
   * `sm:max-w-*`. `lg` is the default: it is what an unstyled dialog rendered at.
   */
  export type DialogContentProps = WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<DialogPrimitive.PortalProps>
    children: Snippet
    showCloseButton?: boolean
    size?: DialogSize
  }
</script>

<script lang="ts">
  import XIcon from '@lucide/svelte/icons/x'

  import { cn } from '../../../utils/cn.js'
  import DialogOverlay from './dialog-overlay.svelte'
  import DialogPortal from './dialog-portal.svelte'

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    size = 'lg',
    ...rest
  }: DialogContentProps = $props()
</script>

<DialogPortal {...portalProps}>
  <DialogOverlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    data-size={size}
    class={cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-[min(var(--radius-4xl),24px)] ring-1 ring-foreground/5 dark:ring-foreground/10 p-6 shadow-xl duration-200 outline-none',
      DIALOG_SIZE_CLASS[size],
      className,
    )}
    {...rest}
  >
    {@render children?.()}
    {#if showCloseButton}
      <DialogPrimitive.Close
        data-slot="dialog-close"
        class="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <XIcon />
        <span class="sr-only">Close</span>
      </DialogPrimitive.Close>
    {/if}
  </DialogPrimitive.Content>
</DialogPortal>
