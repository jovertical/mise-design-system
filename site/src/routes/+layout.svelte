<script lang="ts">
  import '../app.css'

  import {
    SidebarInset,
    SidebarProvider,
    ThemeProvider,
    Toaster,
  } from '@jovertical/mise-design-system'
  import DocsHeader from '#modules/shell/components/docs-header.svelte'
  import DocsSidebar from '#modules/shell/components/docs-sidebar.svelte'
  import OnThisPage from '#modules/shell/components/on-this-page.svelte'
  import SchemeFromUrl from '#modules/shell/components/scheme-from-url.svelte'

  let { children } = $props()
</script>

<ThemeProvider storageKey="mise-docs-theme">
  <SchemeFromUrl />
  <SidebarProvider>
    <DocsSidebar />
    <SidebarInset>
      <DocsHeader />
      <div class="mx-auto flex w-full max-w-content min-w-0 flex-1 gap-10 px-6 py-8">
        <main class="min-w-0 flex-1">{@render children()}</main>
        <OnThisPage />
      </div>
    </SidebarInset>
  </SidebarProvider>
  <Toaster />
</ThemeProvider>
