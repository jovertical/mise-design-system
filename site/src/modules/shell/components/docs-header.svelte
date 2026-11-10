<!-- The bar above every page: the sidebar toggle, search, where else to go, the scheme. -->
<script lang="ts">
  import {
    Button,
    SidebarTrigger,
    SiteHeader,
    SiteHeaderSeparator,
    ThemeToggle,
  } from '@jovertical/mise-design-system'
  import { resolve } from '$app/paths'

  import SearchPalette from './search-palette.svelte'

  // /demo/ is the logistics example, a separate app on the same Pages site,
  // so it is a plain path under the base rather than a route of this one.
  const links = [
    { label: 'Demo', href: `${resolve('/')}demo/` },
    { label: 'npm', href: 'https://www.npmjs.com/package/@jovertical/mise-design-system' },
    { label: 'GitHub', href: 'https://github.com/jovertical/mise-design-system' },
  ]
</script>

<SiteHeader>
  <SidebarTrigger />
  <SiteHeaderSeparator />
  <SearchPalette />
  <nav class="flex items-center gap-1" aria-label="Elsewhere">
    {#each links as link (link.label)}
      <Button variant="ghost" size="sm" href={link.href} class="hidden sm:inline-flex">
        {link.label}
      </Button>
    {/each}
    <ThemeToggle />
  </nav>
</SiteHeader>
