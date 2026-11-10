<!--
  Origin: mise
  Diverged: none. One row of `SidebarNav`, at the top level or inside a
    group: a link, or a page not built yet drawn as text. Not exported.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'

  import type { SidebarNavLink, SidebarNavSubLink } from './sidebar-nav.js'
  import type { SidebarNavLinkSnippetProps } from './sidebar-nav.svelte'

  export type SidebarNavLinkProps = {
    item: SidebarNavLink | SidebarNavSubLink
    /** The `href` of the row that owns the current path. */
    active: string | undefined
    link?: Snippet<[SidebarNavLinkSnippetProps]>
    /** A row inside a group: drawn as a sub-row, without an icon. */
    sub?: boolean
  }
</script>

<script lang="ts">
  import Badge from '../../data-display/badge/badge.svelte'
  import SidebarMenuButton from './sidebar-menu-button.svelte'
  import SidebarMenuItem from './sidebar-menu-item.svelte'
  import SidebarMenuSubButton from './sidebar-menu-sub-button.svelte'
  import SidebarMenuSubItem from './sidebar-menu-sub-item.svelte'

  let { item, active, link, sub = false }: SidebarNavLinkProps = $props()

  const isActive = $derived(item.href === active)
  const icon = $derived('icon' in item ? item.icon : undefined)
</script>

{#snippet content()}
  {#if icon}
    {@const Icon = icon}
    <Icon />
  {/if}
  <!-- The label hides itself in the icon rail: the button's `span:last-child`
       rule would take the badge on a badged row and leave the label. -->
  <span class="min-w-0 flex-1 truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
  {#if item.badge !== undefined}
    <Badge
      variant="soft"
      tone={item.badgeTone ?? 'neutral'}
      count={typeof item.badge === 'number'}
      class="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
    >
      {item.badge}
    </Badge>
  {/if}
{/snippet}

{#snippet anchor(props: Record<string, unknown>)}
  {#if item.disabled}
    <span {...props} aria-disabled="true">{@render content()}</span>
  {:else if link}
    {@render link({
      href: item.href,
      props: { ...props, href: item.href, 'aria-current': isActive ? 'page' : undefined },
      content,
    })}
  {:else}
    <!-- `href` after the spread: a sub-button's props carry its own, unset. -->
    <a {...props} href={item.href} aria-current={isActive ? 'page' : undefined}>
      {@render content()}
    </a>
  {/if}
{/snippet}

{#if sub}
  <SidebarMenuSubItem>
    <SidebarMenuSubButton {isActive}>
      {#snippet child({ props })}
        {@render anchor(props)}
      {/snippet}
    </SidebarMenuSubButton>
  </SidebarMenuSubItem>
{:else}
  <SidebarMenuItem>
    <SidebarMenuButton {isActive} tooltip={item.label}>
      {#snippet child({ props })}
        {@render anchor(props)}
      {/snippet}
    </SidebarMenuButton>
  </SidebarMenuItem>
{/if}
