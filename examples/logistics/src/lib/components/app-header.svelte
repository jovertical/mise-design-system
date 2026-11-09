<!-- The bar above every screen: the sidebar toggle, where you are, the scheme. -->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Separator,
    SidebarTrigger,
    ThemeToggle,
  } from '@jovertical/mise-design-system'
  import { crumb } from '#lib/breadcrumb.svelte.js'
  import SearchPalette from '#lib/components/search-palette.svelte'
  import UserMenu from '#lib/components/user-menu.svelte'
  import { locate } from '#lib/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  let { onReset }: { onReset?: () => void } = $props()

  const path = $derived(page.url.pathname.replace(resolve('/'), '/'))
  const here = $derived(locate(path))
  // Deeper than its menu item (an order's page): the record is the last step.
  const leaf = $derived(
    here && here.item.href !== '/' && path.length > here.item.href.length
      ? (crumb.leaf ?? decodeURIComponent(path.slice(here.item.href.length + 1)))
      : null,
  )
</script>

<header class="bg-background flex h-14 shrink-0 items-center gap-2 border-b px-4">
  <SidebarTrigger />
  <Separator orientation="vertical" class="mx-1 h-4" />
  {#if here}
    <Breadcrumb>
      <BreadcrumbList>
        {#if here.group.label !== here.item.label}
          <BreadcrumbItem class="hidden md:block">{here.group.label}</BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
        {/if}
        {#if leaf}
          <BreadcrumbItem>
            <BreadcrumbLink href={resolve(here.item.href)}>{here.item.label}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{leaf}</BreadcrumbPage></BreadcrumbItem>
        {:else}
          <BreadcrumbItem><BreadcrumbPage>{here.item.label}</BreadcrumbPage></BreadcrumbItem>
        {/if}
      </BreadcrumbList>
    </Breadcrumb>
  {/if}
  <div class="ml-auto flex items-center gap-2">
    <SearchPalette />
    <ThemeToggle />
    <UserMenu {onReset} />
  </div>
</header>
