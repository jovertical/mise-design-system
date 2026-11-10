<!-- The bar above every screen: the sidebar toggle, where you are, the scheme. -->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    SidebarTrigger,
    SiteHeader,
    SiteHeaderSeparator,
    ThemeToggle,
  } from '@jovertical/mise-design-system'
  import { crumb } from '#modules/shell/utils/breadcrumb.svelte.js'
  import { locate } from '#modules/shell/utils/navigation.js'
  import { resolve } from '$app/paths'
  import { page } from '$app/state'
  import SearchPalette from './search-palette.svelte'
  import UserMenu from './user-menu.svelte'

  let { onReset }: { onReset?: () => void } = $props()

  const path = $derived(page.url.pathname.replace(resolve('/'), '/'))
  const here = $derived(locate(path))
  // Deeper than its menu item (an order's page): the record is the next step,
  // named by the page or taken from the URL. A create or edit page adds its
  // step after it, and the record becomes a link back to its page.
  type Step = { label: string; href: string | null }

  const trail = $derived.by((): Step[] => {
    if (!here || here.item.href === '/' || path.length <= here.item.href.length) return []

    const [record] = path.slice(here.item.href.length + 1).split('/')
    const recordLabel = crumb.leaf ?? decodeURIComponent(record)

    if (!crumb.step) return [{ label: recordLabel, href: null }]

    if (record === 'new') return [{ label: crumb.step, href: null }]

    return [
      { label: recordLabel, href: `${here.item.href}/${record}` },
      { label: crumb.step, href: null },
    ]
  })
</script>

<!-- The floating bar the client portal has, drawn by mise's SiteHeader. -->
<SiteHeader>
  <SidebarTrigger />
  <SiteHeaderSeparator />
  {#if here}
    <Breadcrumb>
      <BreadcrumbList>
        {#if here.group.label !== here.item.label}
          <BreadcrumbItem class="hidden md:block">{here.group.label}</BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
        {/if}
        {#if trail.length > 0}
          <BreadcrumbItem>
            <BreadcrumbLink href={resolve(here.item.href)}>{here.item.label}</BreadcrumbLink>
          </BreadcrumbItem>
          {#each trail as step (step.label)}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {#if step.href}
                <BreadcrumbLink href={resolve('/') + step.href.slice(1)}
                  >{step.label}</BreadcrumbLink
                >
              {:else}
                <BreadcrumbPage>{step.label}</BreadcrumbPage>
              {/if}
            </BreadcrumbItem>
          {/each}
        {:else}
          <BreadcrumbItem><BreadcrumbPage>{here.item.label}</BreadcrumbPage></BreadcrumbItem>
        {/if}
      </BreadcrumbList>
    </Breadcrumb>
  {/if}
  <SearchPalette />
  <div class="flex items-center gap-2">
    <ThemeToggle />
    <UserMenu {onReset} />
  </div>
</SiteHeader>
