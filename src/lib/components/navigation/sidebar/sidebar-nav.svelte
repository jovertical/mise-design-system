<!--
  Origin: mise
  Diverged: none. Modelled on the master portal's `nav-main.tsx` (2026-11-10):
    sections are explicit rather than inferred from a flat list, remembering
    open groups is opt-in, and a closed group's links leave the tab order.
-->
<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  import type { WithElementRef } from '../../../utils/types.js'
  import type { SidebarNavSection } from './sidebar-nav.js'

  /** What `link` receives: the row's `href`, its attributes, and what it shows. */
  export type SidebarNavLinkSnippetProps = {
    href: string
    props: Record<string, unknown>
    content: Snippet
  }

  /**
   * The app's menu drawn from data, inside `Sidebar`: sections of rows and
   * groups, with the row that owns `current` lit and the group holding it
   * open. Built on the sidebar's own parts, so it follows the `sidetheme`.
   */
  export type SidebarNavProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    sections: SidebarNavSection[]
    /** The path to match the rows' `href`s against, e.g. the page's pathname. */
    current: string
    /** Remembers which groups are open in `localStorage` under this key. */
    persistKey?: string
    /**
     * Renders a row's link, for a router with its own (Inertia's `Link`).
     * Without it a row is an `<a href>`, which SvelteKit routes.
     */
    link?: Snippet<[SidebarNavLinkSnippetProps]>
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { SvelteSet } from 'svelte/reactivity'

  import { cn } from '../../../utils/cn.js'
  import SidebarGroup from './sidebar-group.svelte'
  import SidebarGroupContent from './sidebar-group-content.svelte'
  import SidebarGroupLabel from './sidebar-group-label.svelte'
  import SidebarMenu from './sidebar-menu.svelte'
  import { activeHref, groupsHolding, isNavGroup } from './sidebar-nav.js'
  import SidebarNavGroup from './sidebar-nav-group.svelte'
  import SidebarNavLink from './sidebar-nav-link.svelte'

  let {
    ref = $bindable(null),
    sections,
    current,
    persistKey,
    link,
    class: className,
    ...rest
  }: SidebarNavProps = $props()

  const active = $derived(activeHref(sections, current))

  /** Storage that is full, blocked or absent leaves the menu working; it only forgets. */
  function readStored(key: string | undefined): string[] {
    if (!key || typeof localStorage === 'undefined') {
      return []
    }

    try {
      const stored: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')

      return Array.isArray(stored) ? stored.filter((label) => typeof label === 'string') : []
    } catch {
      return []
    }
  }

  const open = new SvelteSet<string>(
    untrack(() => [...readStored(persistKey), ...groupsHolding(sections, active)]),
  )

  // The group holding the current row always opens, so it is never hidden.
  $effect(() => {
    for (const label of groupsHolding(sections, active)) {
      open.add(label)
    }
  })

  $effect(() => {
    const labels = [...open]

    if (!persistKey) {
      return
    }

    try {
      localStorage.setItem(persistKey, JSON.stringify(labels))
    } catch {
      // Full or blocked: the menu still works, it just forgets.
    }
  })

  function toggle(label: string) {
    if (open.has(label)) {
      open.delete(label)

      return
    }

    open.add(label)
  }
</script>

<div
  bind:this={ref}
  data-slot="sidebar-nav"
  class={cn('flex min-w-0 flex-col', className)}
  {...rest}
>
  {#each sections as section, index (section.label ?? index)}
    <SidebarGroup class={cn(index > 0 && 'pt-0')}>
      {#if section.label}
        <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
      {/if}
      <SidebarGroupContent>
        <SidebarMenu>
          {#each section.items as item (item.label)}
            {#if isNavGroup(item)}
              <SidebarNavGroup
                group={item}
                {active}
                {link}
                open={open.has(item.label)}
                ontoggle={() => toggle(item.label)}
                onopen={() => open.add(item.label)}
              />
            {:else}
              <SidebarNavLink {item} {active} {link} />
            {/if}
          {/each}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  {/each}
</div>
