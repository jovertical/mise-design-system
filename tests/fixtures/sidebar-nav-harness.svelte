<script lang="ts">
  import {
    Sidebar,
    SidebarContent,
    SidebarNav,
    type SidebarNavSection,
    SidebarProvider,
  } from '../../src/lib/index.js'

  let {
    current,
    persistKey,
    customLink = false,
    open = true,
    headed = false,
  }: {
    current: string
    persistKey?: string
    customLink?: boolean
    open?: boolean
    headed?: boolean
  } = $props()

  const HEADED: SidebarNavSection = {
    label: 'Components',
    items: [
      {
        label: 'Forms',
        items: [
          { heading: 'Text input' },
          { label: 'Input', href: '/components/forms/input' },
          { heading: 'Choices' },
          { label: 'Select', href: '/components/forms/select' },
        ],
      },
    ],
  }

  const BASE: SidebarNavSection[] = [
    {
      label: 'Operations',
      items: [
        { label: 'Overview', href: '/' },
        { label: 'Orders', href: '/orders' },
        {
          label: 'Sales',
          href: '/sales',
          items: [
            { label: 'Invoices', href: '/sales/invoices' },
            { label: 'Refunds', href: '/sales/refunds' },
          ],
        },
      ],
    },
    {
      label: 'More',
      items: [
        { label: 'Support', href: '/support', badge: 3, badgeTone: 'warning' },
        { label: 'Marketplace', href: '/marketplace', badge: 'Soon', disabled: true },
      ],
    },
  ]

  const SECTIONS: SidebarNavSection[] = $derived(headed ? [...BASE, HEADED] : BASE)
</script>

<SidebarProvider {open}>
  <Sidebar collapsible="icon">
    <SidebarContent>
      {#if customLink}
        <SidebarNav sections={SECTIONS} {current} {persistKey}>
          {#snippet link({ href, props, content })}
            <a {href} {...props} data-router="custom">{@render content()}</a>
          {/snippet}
        </SidebarNav>
      {:else}
        <SidebarNav sections={SECTIONS} {current} {persistKey} />
      {/if}
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
