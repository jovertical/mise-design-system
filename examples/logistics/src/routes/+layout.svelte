<script lang="ts">
  import '../app.css'

  import {
    NavigationProgress,
    SidebarInset,
    SidebarProvider,
    ThemeProvider,
    Toaster,
  } from '@jovertical/mise-design-system'
  import AppHeader from '#lib/components/app-header.svelte'
  import AppSidebar from '#lib/components/app-sidebar.svelte'
  import { navigating } from '$app/state'

  let { children } = $props()
</script>

<ThemeProvider storageKey="mise-logistics-demo-theme">
  <NavigationProgress pending={navigating.to !== null} />
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <main class="flex-1">{@render children()}</main>
    </SidebarInset>
  </SidebarProvider>
  <Toaster />
</ThemeProvider>
