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
  import ResetDemoDialog from '#lib/components/reset-demo-dialog.svelte'
  import SchemeFromUrl from '#lib/components/scheme-from-url.svelte'
  import { store } from '#lib/data/store.svelte.js'
  import { navigating } from '$app/state'

  let { children } = $props()

  let resetting = $state(false)

  // Save the demo's data a moment after any change: the snapshot reads every
  // field, so the effect reruns on any edit, and the timer batches a burst.
  $effect(() => {
    $state.snapshot(store.data)
    const timer = setTimeout(() => store.save(), 300)
    return () => clearTimeout(timer)
  })
</script>

<ThemeProvider storageKey="mise-logistics-demo-theme">
  <SchemeFromUrl />
  <NavigationProgress pending={navigating.to !== null} />
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader onReset={() => (resetting = true)} />
      <!-- Capped and centred, as in the client portal, so a table does not
           stretch across an ultrawide display. -->
      <main class="mx-auto w-full max-w-content min-w-0 flex-1">{@render children()}</main>
    </SidebarInset>
  </SidebarProvider>
  <ResetDemoDialog bind:open={resetting} />
  <Toaster />
</ThemeProvider>
