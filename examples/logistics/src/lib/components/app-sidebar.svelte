<!--
  The demo's sidebar: the brand, one group per NAVIGATION group, and the
  user menu. Links go through resolve(), so they carry the Pages base path.
-->
<script lang="ts">
  import {
    Badge,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from '@jovertical/mise-design-system'
  import { getSettings } from '#lib/data/settings.js'
  import { store } from '#lib/data/store.svelte.js'
  import { locate, NAVIGATION } from '#lib/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const current = $derived(locate(page.url.pathname.replace(resolve('/'), '/'))?.item.href)
</script>

<Sidebar sidetheme="light" collapsible="icon">
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" noHover>
          <span
            class="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold"
          >
            m
          </span>
          <span class="flex min-w-0 flex-col leading-tight">
            <span class="truncate font-semibold" title={getSettings(store).companyName}>
              {getSettings(store).companyName}
            </span>
            <span class="text-muted-foreground text-xs">Operations</span>
          </span>
          <Badge variant="outline" class="ml-auto shrink-0">demo</Badge>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>

  <SidebarContent>
    {#each NAVIGATION as group (group.label)}
      <SidebarGroup>
        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
        <SidebarMenu>
          {#each group.items as item (item.href)}
            <SidebarMenuItem>
              <SidebarMenuButton isActive={current === item.href} tooltip={item.label}>
                {#snippet child({ props })}
                  <a href={resolve(item.href)} {...props}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                {/snippet}
              </SidebarMenuButton>
            </SidebarMenuItem>
          {/each}
        </SidebarMenu>
      </SidebarGroup>
    {/each}
  </SidebarContent>
</Sidebar>
