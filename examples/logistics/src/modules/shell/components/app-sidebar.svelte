<!--
  The demo's sidebar: the brand, then NAVIGATION drawn by mise's SidebarNav.
  Links go through resolve(), so they carry the Pages base path, and the
  current row is matched against the full path.
-->
<script lang="ts">
  import {
    Badge,
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarNav,
    type SidebarNavSection,
  } from '@jovertical/mise-design-system'
  import { store } from '#modules/core/data/store.svelte.js'
  import { getSettings } from '#modules/settings/data/index.js'
  import { NAVIGATION } from '#modules/shell/utils/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const sections: SidebarNavSection[] = NAVIGATION.map((group) => ({
    label: group.label,
    items: group.items.map((item) => ({ ...item, href: resolve(item.href) })),
  }))
</script>

<Sidebar collapsible="icon">
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" noHover>
          <!-- Collapsed to icons, the square fills the rail's cell like the rows below it,
               and the name and badge go, so nothing pushes it off centre. -->
          <span
            class="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-xl"
          >
            m
          </span>
          <span class="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span class="truncate font-semibold" title={getSettings(store).companyName}>
              {getSettings(store).companyName}
            </span>
            <span class="text-muted-foreground text-xs">Operations</span>
          </span>
          <Badge variant="outline" class="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
            >demo</Badge
          >
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>

  <SidebarContent>
    <SidebarNav {sections} current={page.url.pathname} />
  </SidebarContent>
</Sidebar>
