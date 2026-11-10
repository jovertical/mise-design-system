<!--
  Origin: the React package 2.23.0 `sidebar.tsx` (`Sidebar`), itself shadcn/ui new-york `sidebar`
  Svelte: shadcn-svelte `sidebar`
  Diverged: The React divergences (`sidetheme`, the published breakpoint) carry
    over. The `primary` gradient reads the brand ramp rather than the React
    package's hard-coded blues, and the `panel` theme drops `font-mono`, which
    only restated the React package's mono body face. The `light` panel is
    `bg-card` in dark: React kept it white under scheme-following text, which
    went white on white. `panel` is the default, as the portals draw it
    (React's was `primary`), and takes the overrides the portals' menus wrote
    by hand (2026-11-10). `panel` draws no edge line.
-->
<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'

  /**
   * Visual treatments for the sidebar shell. `panel`, the default, reads
   * entirely from the `--sidebar-*` tokens, so it follows light and dark;
   * `primary` is a brand gradient panel; `light` a white panel with a brand
   * active pill.
   */
  export type SidebarSideTheme = 'primary' | 'light' | 'panel'

  export type SidebarProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
    sidetheme?: SidebarSideTheme
  }
</script>

<script lang="ts">
  import { cn } from '../../../utils/cn.js'
  import Sheet from '../../overlays/sheet/sheet.svelte'
  import SheetContent from '../../overlays/sheet/sheet-content.svelte'
  import SheetDescription from '../../overlays/sheet/sheet-description.svelte'
  import SheetHeader from '../../overlays/sheet/sheet-header.svelte'
  import SheetTitle from '../../overlays/sheet/sheet-title.svelte'
  import { SIDEBAR_WIDTH_MOBILE, useSidebar } from './context.svelte.js'

  let {
    ref = $bindable(null),
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    sidetheme = 'panel',
    class: className,
    children,
    ...rest
  }: SidebarProps = $props()

  const sidebar = useSidebar()

  const THEME_SURFACE: Record<SidebarSideTheme, string> = {
    primary:
      'bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-800)_100%)] text-white',
    light: 'bg-white dark:bg-card text-foreground',
    panel: 'bg-sidebar text-sidebar-foreground',
  }

  const THEME_TEXT: Record<SidebarSideTheme, string> = {
    primary: 'text-white',
    light: 'text-foreground',
    panel: 'text-sidebar-foreground',
  }
</script>

{#if collapsible === 'none'}
  <div
    bind:this={ref}
    data-slot="sidebar"
    data-sidetheme={sidetheme}
    class={cn('flex h-full w-(--sidebar-width) flex-col', THEME_SURFACE[sidetheme], className)}
    {...rest}
  >
    {@render children?.()}
  </div>
{:else if sidebar.isMobile}
  <Sheet bind:open={() => sidebar.openMobile, (value) => sidebar.setOpenMobile(value)}>
    <!-- `group`, as on the desktop wrapper: the themed rules read an ancestor carrying it. -->
    <SheetContent
      data-sidebar="sidebar"
      data-slot="sidebar"
      data-sidetheme={sidetheme}
      data-mobile="true"
      class={cn('group w-(--sidebar-width) p-0 [&>button]:hidden', THEME_SURFACE[sidetheme])}
      style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
      {side}
    >
      <SheetHeader class="sr-only">
        <SheetTitle>Sidebar</SheetTitle>
        <SheetDescription>Displays the mobile sidebar.</SheetDescription>
      </SheetHeader>
      <div class="flex h-full w-full flex-col">{@render children?.()}</div>
    </SheetContent>
  </Sheet>
{:else}
  <div
    bind:this={ref}
    class={cn(
      'group peer hidden group-data-[mobile=false]/sidebar-wrapper:block',
      THEME_TEXT[sidetheme],
    )}
    data-state={sidebar.state}
    data-collapsible={sidebar.state === 'collapsed' ? collapsible : ''}
    data-variant={variant}
    data-sidetheme={sidetheme}
    data-side={side}
    data-slot="sidebar"
  >
    <!-- The gap the sidebar keeps open on desktop. -->
    <div
      data-slot="sidebar-gap"
      class={cn(
        'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
        'group-data-[collapsible=offcanvas]:w-0',
        'group-data-[side=right]:rotate-180',
        variant === 'floating' || variant === 'inset'
          ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
      )}
    ></div>
    <div
      data-slot="sidebar-container"
      class={cn(
        'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear group-data-[mobile=false]/sidebar-wrapper:flex',
        side === 'left'
          ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
          : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
        variant === 'floating' || variant === 'inset'
          ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
          : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
        // The panel's own surface and corners separate it; a line would double the edge.
        'group-data-[sidetheme=panel]:border-r-0 group-data-[sidetheme=panel]:border-l-0',
        className,
      )}
      {...rest}
    >
      <div
        data-sidebar="sidebar"
        data-slot="sidebar-inner"
        class={cn(
          'flex h-full w-full flex-col',
          'group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm',
          'group-data-[sidetheme=panel]:rounded-2xl!',
          'group-data-[sidetheme=primary]:bg-[linear-gradient(180deg,var(--color-primary-900)_0%,var(--color-primary-800)_100%)]',
          'group-data-[sidetheme=light]:bg-white dark:group-data-[sidetheme=light]:bg-card',
          'group-data-[sidetheme=panel]:bg-sidebar',
        )}
      >
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
