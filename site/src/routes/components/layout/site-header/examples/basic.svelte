<!--
  The bar a shell puts above every page: the sidebar's trigger, where you
  are, and search, on a card over a blurred band. In its shell, as the docs'
  own header is; the box's transform holds the shell inside it.
-->
<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    CommandTrigger,
    PageHeader,
    PageLayout,
    Sidebar,
    SidebarContent,
    SidebarInset,
    SidebarNav,
    type SidebarNavSection,
    SidebarProvider,
    SidebarTrigger,
    SiteHeader,
    SiteHeaderSeparator,
  } from '@jovertical/mise-design-system'

  const SECTIONS: SidebarNavSection[] = [
    {
      label: 'Operations',
      items: [
        { label: 'Orders', href: '#/orders' },
        { label: 'Fleet', href: '#/fleet' },
      ],
    },
  ]
</script>

<div class="h-[420px] w-full overflow-hidden rounded-xl border [transform:translateZ(0)]">
  <SidebarProvider class="min-h-0">
    <Sidebar variant="floating">
      <SidebarContent><SidebarNav sections={SECTIONS} current="#/orders" /></SidebarContent>
    </Sidebar>
    <SidebarInset>
      <SiteHeader>
        <SidebarTrigger />
        <SiteHeaderSeparator />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#/orders">Orders</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>OR-2041</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CommandTrigger hotkey={false} class="ml-auto w-48 md:w-64" />
      </SiteHeader>
      <PageLayout>
        <PageHeader title="OR-2041" description="Bloom & Stem · placed 9 Jul" />
      </PageLayout>
    </SidebarInset>
  </SidebarProvider>
</div>
