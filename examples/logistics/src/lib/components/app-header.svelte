<!-- The bar above every screen: the sidebar toggle, where you are, the scheme. -->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Separator,
    SidebarTrigger,
    ThemeToggle,
  } from '@jovertical/mise-design-system'
  import { locate } from '#lib/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  const here = $derived(locate(page.url.pathname.replace(resolve('/'), '/')))
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
        <BreadcrumbItem><BreadcrumbPage>{here.item.label}</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  {/if}
  <div class="ml-auto"><ThemeToggle /></div>
</header>
