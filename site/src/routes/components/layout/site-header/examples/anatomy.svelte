<script lang="ts">
  import {
    CommandTrigger,
    SidebarProvider,
    SidebarTrigger,
    SiteHeader,
    SiteHeaderSeparator,
  } from '@jovertical/mise-design-system'
</script>

<div class="bg-muted w-[40rem] overflow-hidden rounded-xl border [transform:translateZ(0)]">
  <SidebarProvider class="min-h-0">
    <div class="w-full pb-6">
      <SiteHeader>
        <SidebarTrigger />
        <SiteHeaderSeparator />
        <span class="text-sm font-medium">Orders</span>
        <CommandTrigger hotkey={false} class="ml-auto w-56" />
      </SiteHeader>
    </div>
  </SidebarProvider>
</div>
