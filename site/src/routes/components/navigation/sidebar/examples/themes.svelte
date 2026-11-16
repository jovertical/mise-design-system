<!--
  `sidetheme` sets the panel's colours once and every row follows: `panel`
  (the default) reads the --sidebar-* tokens and follows the scheme,
  `primary` is the brand gradient, `light` a white panel. `variant` is the
  panel's shape; `panel` pairs with `floating` unless one is given.
-->
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
    ToggleGroup,
    ToggleGroupItem,
  } from '@jovertical/mise-design-system'
  import IconBuildingWarehouse from '@tabler/icons-svelte-runes/icons/building-warehouse'
  import IconShoppingCart from '@tabler/icons-svelte-runes/icons/shopping-cart'

  const THEMES: SidebarSideTheme[] = ['panel', 'primary', 'light']
  const VARIANTS = ['sidebar', 'floating', 'inset'] as const

  let sidetheme: SidebarSideTheme = $state('panel')
  let variant: (typeof VARIANTS)[number] = $state('floating')
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex flex-wrap gap-4">
    <ToggleGroup type="single" bind:value={sidetheme} aria-label="Theme">
      {#each THEMES as theme (theme)}
        <ToggleGroupItem value={theme}>{theme}</ToggleGroupItem>
      {/each}
    </ToggleGroup>
    <ToggleGroup type="single" bind:value={variant} aria-label="Variant">
      {#each VARIANTS as option (option)}
        <ToggleGroupItem value={option}>{option}</ToggleGroupItem>
      {/each}
    </ToggleGroup>
  </div>
  <div class="h-[360px] w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
    <SidebarProvider class="min-h-0">
      <Sidebar {sidetheme} {variant}>
        <SidebarHeader class="px-3 py-2 text-sm font-semibold">Riverside</SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Stock</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive><IconBuildingWarehouse />Locations</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton><IconShoppingCart />Orders</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset class="p-4"></SidebarInset>
    </SidebarProvider>
  </div>
</div>
