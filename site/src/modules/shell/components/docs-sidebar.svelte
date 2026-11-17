<!--
  The docs' sidebar: the name and version, then every written page, grouped as
  navSections() orders them: the guides, then a folding group per component
  section. Links go through resolve(), so they carry the Pages base path. Each
  group has an icon for the collapsed rail, and the open groups are remembered.
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
  } from '@jovertical/mise-design-system'
  import IconChartBar from '@tabler/icons-svelte-runes/icons/chart-bar'
  import IconClick from '@tabler/icons-svelte-runes/icons/click'
  import IconCompass from '@tabler/icons-svelte-runes/icons/compass'
  import IconForms from '@tabler/icons-svelte-runes/icons/forms'
  import IconLayout from '@tabler/icons-svelte-runes/icons/layout'
  import IconMessageCircle from '@tabler/icons-svelte-runes/icons/message-circle'
  import IconStack2 from '@tabler/icons-svelte-runes/icons/stack-2'
  import IconTypography from '@tabler/icons-svelte-runes/icons/typography'
  import type { Component } from 'svelte'

  import { navSections, withHrefs } from '#modules/nav/data/navigation.js'
  import { PAGES } from '#modules/nav/data/pages.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const ICONS: Record<string, Component> = {
    Typography: IconTypography,
    Actions: IconClick,
    Forms: IconForms,
    Navigation: IconCompass,
    Layout: IconLayout,
    Overlays: IconStack2,
    Feedback: IconMessageCircle,
    'Data display': IconChartBar,
  }

  const sections = withHrefs(navSections(PAGES), (href) => resolve(href as '/')).map((section) => ({
    ...section,
    items: section.items.map((item) =>
      'items' in item ? { ...item, icon: ICONS[item.label] } : item,
    ),
  }))
</script>

<Sidebar collapsible="icon">
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" noHover>
          {#snippet child({ props })}
            <a href={resolve('/')} {...props}>
              <span
                class="bg-primary text-primary-foreground grid size-8 shrink-0 place-items-center rounded-md text-sm font-semibold group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:rounded-xl"
              >
                m
              </span>
              <span
                class="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden"
              >
                <span class="truncate font-semibold">mise</span>
                <span class="text-muted-foreground text-xs">Design system</span>
              </span>
              <Badge
                variant="outline"
                class="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
              >
                {__MISE_VERSION__}
              </Badge>
            </a>
          {/snippet}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  </SidebarHeader>

  <SidebarContent>
    <SidebarNav {sections} current={page.url.pathname} persistKey="mise-docs-nav" />
  </SidebarContent>
</Sidebar>
