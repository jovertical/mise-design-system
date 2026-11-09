<!--
  The demo's sidebar: the brand, one group per NAVIGATION group, and the
  user menu. Links go through resolve(), so they carry the Pages base path.
-->
<script lang="ts">
  import {
    Badge,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from '@jovertical/mise-design-system'
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down'
  import Info from '@lucide/svelte/icons/info'
  import RotateCcw from '@lucide/svelte/icons/rotate-ccw'
  import { locate, NAVIGATION } from '#lib/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let { onReset }: { onReset?: () => void } = $props()

  const current = $derived(locate(page.url.pathname.replace(resolve('/'), '/'))?.item.href)
</script>

<Sidebar sidetheme="light">
  <SidebarHeader>
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" noHover>
          <span
            class="bg-primary text-primary-foreground grid size-8 place-items-center rounded-md text-sm font-semibold"
            >m</span
          >
          <span class="flex flex-col leading-tight">
            <span class="font-semibold">mise Logistics</span>
            <span class="text-muted-foreground text-xs">Operations</span>
          </span>
          <Badge variant="outline" class="ml-auto">demo</Badge>
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

  <SidebarFooter>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <SidebarMenuButton size="lg" {...props}>
            <span
              class="bg-foreground/[0.07] grid size-8 place-items-center rounded-full text-xs font-medium"
              >OM</span
            >
            <span class="flex flex-col leading-tight">
              <span class="font-medium">Ops manager</span>
              <span class="text-muted-foreground text-xs">Riverside DC</span>
            </span>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" class="w-56">
        <DropdownMenuLabel>Demo</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onReset?.()}
          ><RotateCcw />Reset demo data</DropdownMenuItem
        >
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {#snippet child({ props })}
            <a href="https://github.com/jovertical/mise-design-system" {...props}
              ><Info />About this demo</a
            >
          {/snippet}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </SidebarFooter>
</Sidebar>
