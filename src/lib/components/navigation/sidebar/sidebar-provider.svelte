<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`SidebarProvider`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: `open` is bindable and `onOpenChange` is kept. React set
    `--sidebar-width: var(--sidebar-width)` inline, which refers to itself and
    is invalid CSS; this sets shadcn's 16rem, which `style` can override.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Owns the open and collapsed state and the CSS variables the whole family
   * reads. It always wraps `Sidebar` and its page, never `Sidebar` alone.
   */
  export type SidebarProviderProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /**
     * Viewport width, in pixels, below which the sidebar becomes a sheet.
     * Raise it when the persistent rail costs the content more room than it is
     * worth.
     */
    mobileBreakpoint?: number
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import TooltipProvider from '../../overlays/tooltip/tooltip-provider.svelte'
  import { SIDEBAR_WIDTH, SIDEBAR_WIDTH_ICON, setSidebar } from './context.svelte.js'

  let {
    ref = $bindable(null),
    open = $bindable(true),
    onOpenChange,
    mobileBreakpoint,
    class: className,
    style,
    children,
    ...rest
  }: SidebarProviderProps = $props()

  const sidebar = setSidebar({
    open: () => open,
    setOpen: (value) => {
      open = value

      onOpenChange?.(value)
    },
    // svelte-ignore state_referenced_locally
    mobileBreakpoint,
  })
</script>

<svelte:window onkeydown={sidebar.handleShortcutKeydown} />

<TooltipProvider>
  <!-- The breakpoint, published for CSS, so a raised `mobileBreakpoint` moves both halves at once. -->
  <div
    bind:this={ref}
    data-slot="sidebar-wrapper"
    data-mobile={sidebar.isMobile}
    style="--sidebar-width: {SIDEBAR_WIDTH}; --sidebar-width-icon: {SIDEBAR_WIDTH_ICON}; {style ??
      ''}"
    class={cn(
      'group/sidebar-wrapper bg-muted has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full',
      className,
    )}
    {...rest}
  >
    {@render children?.()}
  </div>
</TooltipProvider>
