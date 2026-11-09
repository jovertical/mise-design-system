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

<!-- A floating bar on a blurred band, as the client portal has it: the page
     scrolls under the band, and the bar stays one card wide. The bar is capped
     at the content column's width and padded like PageLayout, so its edges
     line up with the page's. -->
<header
  class="bg-muted/80 supports-[backdrop-filter]:bg-muted/60 sticky top-0 z-20 shrink-0 py-2 backdrop-blur"
>
  <div class="mx-auto w-full max-w-content px-4 lg:px-6">
    <div class="bg-card flex h-12 w-full items-center gap-2 rounded-xl border px-2">
      <SidebarTrigger />
      <Separator orientation="vertical" class="mx-1 h-4" />
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
    </div>
  </div>
</header>
