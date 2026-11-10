<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconActivity from '@tabler/icons-svelte-runes/icons/activity'
  import IconApps from '@tabler/icons-svelte-runes/icons/apps'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconCreditCard from '@tabler/icons-svelte-runes/icons/credit-card'
  import IconDevices from '@tabler/icons-svelte-runes/icons/devices'
  import IconLifebuoy from '@tabler/icons-svelte-runes/icons/lifebuoy'
  import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
  import IconUsersGroup from '@tabler/icons-svelte-runes/icons/users-group'
  import type { SidebarSideTheme } from './sidebar.svelte'
  import Sidebar from './sidebar.svelte'
  import SidebarContent from './sidebar-content.svelte'
  import SidebarGroup from './sidebar-group.svelte'
  import SidebarGroupLabel from './sidebar-group-label.svelte'
  import SidebarHeader from './sidebar-header.svelte'
  import SidebarInset from './sidebar-inset.svelte'
  import SidebarMenu from './sidebar-menu.svelte'
  import SidebarMenuButton from './sidebar-menu-button.svelte'
  import SidebarMenuItem from './sidebar-menu-item.svelte'
  import type { SidebarNavSection } from './sidebar-nav.js'
  import SidebarNav from './sidebar-nav.svelte'
  import SidebarProvider from './sidebar-provider.svelte'
  import SidebarTrigger from './sidebar-trigger.svelte'

  const THEMES: SidebarSideTheme[] = ['panel', 'primary', 'light']

  /** An operations console's menu, in the shape the portals draw. */
  const NAV: SidebarNavSection[] = [
    {
      label: 'Operations',
      items: [
        {
          label: 'Overview',
          icon: IconActivity,
          items: [
            { label: 'Sales overview', href: '/overview/sales' },
            { label: 'Stock overview', href: '/overview/stock' },
          ],
        },
        { label: 'Locations', href: '/locations', icon: IconBuildingStore },
        {
          label: 'Hardware',
          icon: IconDevices,
          href: '/hardware',
          items: [
            { label: 'Registers', href: '/hardware/registers' },
            { label: 'Printers', href: '/hardware/printers' },
          ],
        },
        {
          label: 'Billing',
          icon: IconCreditCard,
          items: [
            { label: 'Invoices', href: '/billing/invoices' },
            { label: 'Payouts', href: '/billing/payouts', badge: 2, badgeTone: 'info' },
          ],
        },
        { label: 'Support', href: '/support', icon: IconLifebuoy, badge: 3, badgeTone: 'warning' },
        {
          label: 'Marketplace',
          href: '/marketplace',
          icon: IconApps,
          badge: 'Soon',
          disabled: true,
        },
      ],
    },
    {
      label: 'Administration',
      items: [
        {
          label: 'Team',
          icon: IconUsersGroup,
          items: [
            { label: 'Members', href: '/team/members' },
            { label: 'Roles', href: '/team/roles' },
          ],
        },
        { label: 'Settings', href: '/settings', icon: IconSettings },
      ],
    },
  ]

  const { Story } = defineMeta({
    title: 'Navigation/Sidebar',
    component: Sidebar,
    tags: ['shadcn'],
    parameters: { layout: 'fullscreen' },
    argTypes: {
      sidetheme: { control: 'inline-radio', options: THEMES },
      collapsible: { control: 'inline-radio', options: ['offcanvas', 'icon', 'none'] },
    },
  })
</script>

{#snippet shell(
  sidetheme: SidebarSideTheme,
  collapsible: 'offcanvas' | 'icon' | 'none' = 'offcanvas',
)}
  <div class="h-[420px] overflow-hidden rounded-xl border [transform:translateZ(0)]">
    <SidebarProvider class="min-h-0">
      <Sidebar {sidetheme} {collapsible}>
        <SidebarHeader class="px-3 py-2 text-sm font-semibold">Riverside</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Stock</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Locations"
                  ><IconBuildingWarehouse />Locations</SidebarMenuButton
                >
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Orders"><IconShoppingCart />Orders</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="General"><IconSettings />General</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset class="flex items-start p-4"><SidebarTrigger /></SidebarInset>
    </SidebarProvider>
  </div>
{/snippet}

<!--
  `SidebarProvider` owns the open and collapsed state and the CSS variables the
  whole family reads; it always wraps `Sidebar` and its page. `sidetheme` sets
  the panel's colours once and every row follows.
-->
<Story name="Playground">
  {#snippet template(args)}
    {@render shell(args.sidetheme ?? 'panel', args.collapsible ?? 'offcanvas')}
  {/snippet}
</Story>

<!--
  The three `sidetheme`s side by side: `panel`, the default, reads the
  `--sidebar-*` tokens and follows the scheme; `primary` is the brand
  gradient; `light` a white panel with a brand pill. Not a React story; added
  to review the themes.
-->
<Story name="Themes" asChild>
  <div class="grid gap-4 p-4 lg:grid-cols-3">
    {#each THEMES as sidetheme}
      {@render shell(sidetheme)}
    {/each}
  </div>
</Story>

{#snippet navShell(current: string, open = true)}
  <div class="h-[640px] overflow-hidden rounded-xl border [transform:translateZ(0)]">
    <SidebarProvider class="min-h-0" {open}>
      <Sidebar collapsible="icon">
        <SidebarHeader class="px-3 py-2 text-sm font-semibold">Riverside</SidebarHeader>
        <SidebarContent>
          <SidebarNav sections={NAV} {current} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset class="flex items-start p-4"><SidebarTrigger /></SidebarInset>
    </SidebarProvider>
  </div>
{/snippet}

<!--
  `SidebarNav` draws the menu from data: sections, rows, groups that open
  (Overview, which only toggles; Hardware, which is also a page), a count, and a
  page not built yet. The row that owns `current` is the pill, and the group
  holding it opens. Here the current page is a printer, so Hardware is open.
-->
<Story name="With nav" asChild>{@render navShell('/hardware/printers/PR-2')}</Story>

<!--
  `collapsible="icon"`: the trigger shrinks the rail to icons, and each row's
  `tooltip` names it while collapsed. Not a React story; added to review the
  collapsed rail.
-->
<Story name="Collapsible to icons" asChild> {@render shell('panel', 'icon')} </Story>

<!--
  `SidebarNav` collapsed to icons: a row keeps its tooltip, and a group opens
  its rows in a menu beside the rail.
-->
<Story name="Nav collapsed to icons" asChild>{@render navShell('/locations', false)}</Story>
