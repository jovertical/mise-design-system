<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    type SidebarSideTheme,
    SidebarTrigger,
  } from '../../src/lib/index.js'

  // No `sidetheme` unless a test passes one, so the shell shows the default.
  let { open = $bindable(true), sidetheme }: { open?: boolean; sidetheme?: SidebarSideTheme } =
    $props()
</script>

<SidebarProvider bind:open>
  <Sidebar collapsible="icon" {sidetheme}>
    <SidebarHeader>Riverside</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Stock</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Locations">Locations</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Orders</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset><SidebarTrigger /></SidebarInset>
</SidebarProvider>
<output data-testid="open">{open ? 'open' : 'closed'}</output>
