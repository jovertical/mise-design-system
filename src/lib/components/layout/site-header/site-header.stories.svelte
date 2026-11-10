<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconPackage from '@tabler/icons-svelte-runes/icons/package'
  import IconTruck from '@tabler/icons-svelte-runes/icons/truck'

  import CommandTrigger from '../../actions/command/command-trigger.svelte'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.svelte'
  import BreadcrumbItem from '../../navigation/breadcrumb/breadcrumb-item.svelte'
  import BreadcrumbLink from '../../navigation/breadcrumb/breadcrumb-link.svelte'
  import BreadcrumbList from '../../navigation/breadcrumb/breadcrumb-list.svelte'
  import BreadcrumbPage from '../../navigation/breadcrumb/breadcrumb-page.svelte'
  import BreadcrumbSeparator from '../../navigation/breadcrumb/breadcrumb-separator.svelte'
  import Sidebar from '../../navigation/sidebar/sidebar.svelte'
  import SidebarContent from '../../navigation/sidebar/sidebar-content.svelte'
  import SidebarInset from '../../navigation/sidebar/sidebar-inset.svelte'
  import type { SidebarNavSection } from '../../navigation/sidebar/sidebar-nav.js'
  import SidebarNav from '../../navigation/sidebar/sidebar-nav.svelte'
  import SidebarProvider from '../../navigation/sidebar/sidebar-provider.svelte'
  import SidebarTrigger from '../../navigation/sidebar/sidebar-trigger.svelte'
  import PageHeader from '../page-header/page-header.svelte'
  import PageLayout from '../page-layout/page-layout.svelte'
  import SiteHeader from './site-header.svelte'
  import SiteHeaderSeparator from './site-header-separator.svelte'

  const NAV: SidebarNavSection[] = [
    {
      items: [
        { label: 'Orders', href: '#orders', icon: IconPackage },
        { label: 'Shipments', href: '#shipments', icon: IconTruck },
      ],
    },
  ]

  const { Story } = defineMeta({
    title: 'Layout/SiteHeader',
    component: SiteHeader,
    tags: ['mise'],
    parameters: { layout: 'fullscreen' },
  })
</script>

<!--
  The bar a shell puts above every page: the sidebar's trigger, where you are,
  and search, on a card floating over a blurred band.
-->
<Story name="Playground" asChild>
  <SidebarProvider class="min-h-0">
    <div class="bg-muted min-h-64 w-full">
      <SiteHeader>
        <SidebarTrigger />
        <SiteHeaderSeparator />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#orders">Orders</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>OR-2041</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CommandTrigger hotkey={false} class="ml-auto w-48 md:w-72" />
      </SiteHeader>
    </div>
  </SidebarProvider>
</Story>

<!--
  In the shell it belongs to: inside `SidebarInset`, above `PageLayout`, its
  edges in line with the page column's.
-->
<Story name="In a shell" asChild>
  <SidebarProvider class="min-h-96">
    <Sidebar variant="floating">
      <SidebarContent><SidebarNav sections={NAV} current="#orders" /></SidebarContent>
    </Sidebar>
    <SidebarInset>
      <SiteHeader>
        <SidebarTrigger />
        <SiteHeaderSeparator />
        <span class="text-sm font-medium">Orders</span>
        <CommandTrigger hotkey={false} class="ml-auto w-48 md:w-72" />
      </SiteHeader>
      <PageLayout>
        <PageHeader title="Orders" description="Every order across your locations." />
      </PageLayout>
    </SidebarInset>
  </SidebarProvider>
</Story>
