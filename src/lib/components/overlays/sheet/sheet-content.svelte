<!--
  Origin: the React package 2.23.0 `sheet.tsx` (`SheetContent`), itself shadcn/ui new-york `sheet`
  Svelte: shadcn-svelte `sheet`
  Diverged: unaudited, as in the React package. The portal and overlay are drawn
    inline, as React draws them; neither is exported, as in React. Adds
    `data-side`, so a caller can style by side without repeating the prop.
    Tabler's x for Lucide's.
-->
<script lang="ts" module>
  import { Dialog as SheetPrimitive } from 'bits-ui'
  import type { Snippet } from 'svelte'

  import type { WithoutChildrenOrChild } from '../../../utils/types.js'

  export const SHEET_SIDE_CLASS = {
    right:
      'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
    left: 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
    top: 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
    bottom:
      'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
  } as const

  export type SheetSide = keyof typeof SHEET_SIDE_CLASS

  export type SheetContentProps = WithoutChildrenOrChild<SheetPrimitive.ContentProps> & {
    side?: SheetSide
    portalProps?: SheetPrimitive.PortalProps
    children?: Snippet
  }
</script>

<script lang="ts">
  import IconX from '@tabler/icons-svelte-runes/icons/x'

  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    side = 'right',
    portalProps,
    class: className,
    children,
    ...rest
  }: SheetContentProps = $props()
</script>

<SheetPrimitive.Portal {...portalProps}>
  <SheetPrimitive.Overlay
    data-slot="sheet-overlay"
    class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
  />
  <SheetPrimitive.Content
    bind:ref
    data-slot="sheet-content"
    data-side={side}
    class={cn(
      'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
      SHEET_SIDE_CLASS[side],
      className,
    )}
    {...rest}
  >
    {@render children?.()}
    <SheetPrimitive.Close
      class="ring-offset-background focus:ring-ring data-[state=open]:bg-muted absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
    >
      <IconX class="size-4" />
      <span class="sr-only">Close</span>
    </SheetPrimitive.Close>
  </SheetPrimitive.Content>
</SheetPrimitive.Portal>
