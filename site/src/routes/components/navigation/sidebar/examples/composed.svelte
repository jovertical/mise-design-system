<!--
  The parts by hand, for a menu SidebarNav does not draw. Each row's
  `tooltip` names it while the sidebar is collapsed to icons.
-->
<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
</script>

<div class="h-[420px] w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
  <SidebarProvider class="min-h-0">
    <Sidebar collapsible="icon">
      <SidebarHeader class="px-3 py-2 text-sm font-semibold">Riverside</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Stock</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Locations">
                <IconBuildingWarehouse />Locations
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Orders"><IconShoppingCart />Orders</SidebarMenuButton>
              <SidebarMenuBadge>12</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings"><IconSettings />Settings</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    <SidebarInset class="flex items-start p-4"><SidebarTrigger /></SidebarInset>
  </SidebarProvider>
</div>
