<!--
  The menu drawn from data by SidebarNav, as most apps (and these docs) draw
  it: sections, rows, a group that opens, a count. The row owning `current`
  is lit and its group opens. The box's transform makes it the containing
  block of the sidebar's fixed panel, so the panel stays inside it; links are
  #/… so the example goes nowhere.
-->
<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarNav,
    type SidebarNavSection,
    SidebarProvider,
    SidebarTrigger,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconLayoutDashboard from '@tabler/icons-svelte-runes/icons/layout-dashboard'
  import IconPackages from '@tabler/icons-svelte-runes/icons/packages'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
  import IconTruck from '@tabler/icons-svelte-runes/icons/truck'

  const SECTIONS: SidebarNavSection[] = [
    {
      label: 'Operations',
      items: [
        { label: 'Overview', href: '#/overview', icon: IconLayoutDashboard },
        { label: 'Orders', href: '#/orders', icon: IconShoppingCart, badge: 3, badgeTone: 'info' },
        {
          label: 'Fleet',
          icon: IconTruck,
          items: [
            { label: 'Vans', href: '#/fleet/vans' },
            { label: 'Trucks', href: '#/fleet/trucks' },
          ],
        },
      ],
    },
    {
      label: 'Inventory',
      items: [
        { label: 'Products', href: '#/products', icon: IconPackages },
        { label: 'Warehouses', href: '#/warehouses', icon: IconBuildingWarehouse },
      ],
    },
  ]
</script>

<div class="h-[420px] w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
  <SidebarProvider class="min-h-0">
    <Sidebar collapsible="icon">
      <SidebarHeader class="px-3 py-2 text-sm font-semibold">Riverside</SidebarHeader>
      <SidebarContent>
        <SidebarNav sections={SECTIONS} current="#/fleet/vans" />
      </SidebarContent>
    </Sidebar>
    <SidebarInset class="flex items-start p-4"><SidebarTrigger /></SidebarInset>
  </SidebarProvider>
</div>
