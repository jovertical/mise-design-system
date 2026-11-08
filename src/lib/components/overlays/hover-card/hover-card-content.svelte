<!--
  Origin: the React package 2.23.0 `hover-card.tsx` (`HoverCardContent`), itself shadcn/ui new-york `hover-card`
  Svelte: shadcn-svelte `hover-card`
  Diverged: the origin variable is bits-ui's
    (`--bits-link-preview-content-transform-origin`). The portal is a prop,
    `portalProps`, as PopoverContent's is, not a separate part.
-->
<script lang="ts" module>
  import { LinkPreview as HoverCardPrimitive } from 'bits-ui'

  /**
   * The floating card. A ring rather than a border, and `rounded-2xl` rather
   * than shadcn's `rounded-md`: 6px was the smallest radius in a system whose
   * cards are 24px.
   */
  export type HoverCardContentProps = HoverCardPrimitive.ContentProps & {
    portalProps?: HoverCardPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    align = 'center',
    sideOffset = 4,
    portalProps,
    class: className,
    ...rest
  }: HoverCardContentProps = $props()
</script>

<HoverCardPrimitive.Portal {...portalProps}>
  <HoverCardPrimitive.Content
    bind:ref
    data-slot="hover-card-content"
    {align}
    {sideOffset}
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-64 origin-(--bits-link-preview-content-transform-origin) rounded-2xl p-4 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10 outline-hidden',
      className,
    )}
    {...rest}
  />
</HoverCardPrimitive.Portal>
