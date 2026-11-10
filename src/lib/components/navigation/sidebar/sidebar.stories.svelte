<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconSettings from '@tabler/icons-svelte-runes/icons/settings'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'
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
  import SidebarProvider from './sidebar-provider.svelte'
  import SidebarTrigger from './sidebar-trigger.svelte'

  const THEMES: SidebarSideTheme[] = ['panel', 'primary', 'light']

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

<!--
  `collapsible="icon"`: the trigger shrinks the rail to icons, and each row's
  `tooltip` names it while collapsed. Not a React story; added to review the
  collapsed rail.
-->
<Story name="Collapsible to icons" asChild> {@render shell('panel', 'icon')} </Story>
