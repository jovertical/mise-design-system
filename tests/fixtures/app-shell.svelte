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
    SidebarTrigger,
  } from '../../src/lib/index.js'

  let { open = $bindable(true) }: { open?: boolean } = $props()
</script>

<SidebarProvider bind:open>
  <Sidebar collapsible="icon" sidetheme="panel">
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
