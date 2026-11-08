<!--
  Origin: the React package 2.23.0 `combobox.tsx` (`ComboboxContent`)
  Diverged: the size and origin variables are bits-ui's
    (`--bits-combobox-anchor-width` and the rest). Base UI's `anchor` is
    bits-ui's `customAnchor`, and marks the panel `data-chips` as React's did;
    `container` is `portalProps.to`.
-->
<script lang="ts" module>
  import { Combobox as ComboboxPrimitive } from 'bits-ui'

  /**
   * The floating panel. Put a `ComboboxList` inside, and a `ComboboxEmpty`
   * for when nothing matches.
   */
  export type ComboboxContentProps = ComboboxPrimitive.ContentProps & {
    portalProps?: ComboboxPrimitive.PortalProps
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'

  let {
    ref = $bindable(null),
    side = 'bottom',
    sideOffset = 6,
    align = 'start',
    alignOffset = 0,
    customAnchor,
    portalProps,
    class: className,
    ...rest
  }: ComboboxContentProps = $props()
</script>

<ComboboxPrimitive.Portal {...portalProps}>
  <ComboboxPrimitive.Content
    bind:ref
    {side}
    {sideOffset}
    {align}
    {alignOffset}
    {customAnchor}
    data-slot="combobox-content"
    data-chips={customAnchor ? true : undefined}
    class={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 group/combobox-content relative isolate z-50 max-h-96 w-(--bits-combobox-anchor-width) max-w-(--bits-combobox-content-available-width) min-w-[calc(var(--bits-combobox-anchor-width)+--spacing(7))] origin-(--bits-combobox-content-transform-origin) overflow-hidden rounded-2xl shadow-md ring-1 duration-100 data-[chips=true]:min-w-(--bits-combobox-anchor-width) *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none',
      className,
    )}
    {...rest}
  />
</ComboboxPrimitive.Portal>
