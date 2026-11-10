<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
  } from '../../src/lib/index.js'

  let { size }: { size: 'md' | 'default' } = $props()
</script>

<Toggle {size} aria-label="Bold">B</Toggle>
<ToggleGroup type="single" {size}>
  <ToggleGroupItem value="day">Day</ToggleGroupItem>
</ToggleGroup>
<SidebarProvider>
  <Sidebar collapsible="none">
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem><SidebarMenuButton {size}>Orders</SidebarMenuButton></SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
