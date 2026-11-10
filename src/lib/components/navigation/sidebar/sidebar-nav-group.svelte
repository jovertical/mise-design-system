<!--
  Origin: mise
  Diverged: none. A `SidebarNav` row that opens a list of rows. It is never
    the current row itself; the pill belongs to the child that owns the path.
    Collapsed to icons, it opens its rows in a menu beside the rail. Not
    exported.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { SidebarNavGroup } from './sidebar-nav.js'
  import type { SidebarNavLinkSnippetProps } from './sidebar-nav.svelte'

  export type SidebarNavGroupProps = {
    group: SidebarNavGroup
    /** The `href` of the row that owns the current path. */
    active: string | undefined
    link?: Snippet<[SidebarNavLinkSnippetProps]>
    open: boolean
    /** The chevron, or a row without an `href`, was pressed. */
    ontoggle: () => void
    /** The row's own link was followed: its list opens. */
    onopen: () => void
  }
</script>

<script lang="ts">
  import IconChevronDown from '@tabler/icons-svelte-runes/icons/chevron-down'
  import IconChevronRight from '@tabler/icons-svelte-runes/icons/chevron-right'

  import DropdownMenu from '../../actions/dropdown-menu/dropdown-menu.svelte'
  import DropdownMenuContent from '../../actions/dropdown-menu/dropdown-menu-content.svelte'
  import DropdownMenuItem from '../../actions/dropdown-menu/dropdown-menu-item.svelte'
  import DropdownMenuTrigger from '../../actions/dropdown-menu/dropdown-menu-trigger.svelte'
  import { useSidebar } from './context.svelte.js'
  import SidebarMenuAction from './sidebar-menu-action.svelte'
  import SidebarMenuButton from './sidebar-menu-button.svelte'
  import SidebarMenuItem from './sidebar-menu-item.svelte'
  import SidebarMenuSub from './sidebar-menu-sub.svelte'
  import SidebarNavLink from './sidebar-nav-link.svelte'

  let { group, active, link, open, ontoggle, onopen }: SidebarNavGroupProps = $props()

  const sidebar = useSidebar()
  const collapsed = $derived(sidebar.state === 'collapsed' && !sidebar.isMobile)
  const toggleLabel = $derived(open ? `Collapse ${group.label}` : `Expand ${group.label}`)
</script>

{#snippet heading()}
  {#if group.icon}
    {@const Icon = group.icon}
    <Icon />
  {/if}
  <span class="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">{group.label}</span>
{/snippet}

{#snippet chevron()}
  {#if open}
    <IconChevronDown class="size-4" />
  {:else}
    <IconChevronRight class="size-4" />
  {/if}
{/snippet}

<SidebarMenuItem>
  {#if collapsed}
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet child({ props })}
          <SidebarMenuButton {...props} aria-label={group.label}>
            {@render heading()}
          </SidebarMenuButton>
        {/snippet}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" sideOffset={8} class="min-w-44">
        {#each group.items as item (item.href)}
          {#snippet label()}
            {item.label}
          {/snippet}
          <DropdownMenuItem disabled={item.disabled}>
            {#snippet child({ props })}
              {#if link}
                {@render link({ href: item.href, props, content: label })}
              {:else}
                <a href={item.href} {...props}>{item.label}</a>
              {/if}
            {/snippet}
          </DropdownMenuItem>
        {/each}
      </DropdownMenuContent>
    </DropdownMenu>
  {:else}
    {#if group.href}
      {@const href = group.href}
      <!-- No tooltip while expanded: its trigger would overwrite `data-state`,
           and collapsed, the group is a menu instead. -->
      <SidebarMenuButton data-state={open ? 'open' : 'closed'}>
        {#snippet child({ props })}
          {#if link}
            {@render link({ href, props: { ...props, onclick: onopen }, content: heading })}
          {:else}
            <a {href} {...props} onclick={onopen}>{@render heading()}</a>
          {/if}
        {/snippet}
      </SidebarMenuButton>
      <SidebarMenuAction aria-label={toggleLabel} aria-expanded={open} onclick={ontoggle}>
        {@render chevron()}
      </SidebarMenuAction>
    {:else}
      <SidebarMenuButton
        data-state={open ? 'open' : 'closed'}
        aria-label={toggleLabel}
        aria-expanded={open}
        onclick={ontoggle}
      >
        {@render heading()}
        <span class="ml-auto group-data-[collapsible=icon]:hidden">{@render chevron()}</span>
      </SidebarMenuButton>
    {/if}
    <div
      class="grid transition-[grid-template-rows] duration-200 ease-out"
      style:grid-template-rows={open ? '1fr' : '0fr'}
    >
      <div class="min-h-0 overflow-hidden" data-slot="sidebar-nav-sub" inert={!open}>
        <SidebarMenuSub>
          {#each group.items as item (item.href)}
            <SidebarNavLink {item} {active} {link} sub />
          {/each}
        </SidebarMenuSub>
      </div>
    </div>
  {/if}
</SidebarMenuItem>
