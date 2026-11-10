<!--
  ⌘K / Ctrl K, or the header's search field: every written page, grouped as
  the sidebar groups them. Command filters as you type; choosing one navigates.
-->
<script lang="ts">
  import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandTrigger,
  } from '@jovertical/mise-design-system'
  import { SECTIONS } from '#modules/nav/data/navigation.js'
  import { PAGES } from '#modules/nav/data/pages.js'
  import { goto } from '$app/navigation'
  import { resolve } from '$app/paths'

  let open = $state(false)

  const groups = SECTIONS.map((section) => ({
    section,
    pages: PAGES.filter((page) => page.section === section).toSorted(
      (first, second) => (first.order ?? 0) - (second.order ?? 0),
    ),
  })).filter((group) => group.pages.length > 0)

  function go(href: string) {
    open = false

    goto(resolve(href as '/'))
  }
</script>

<CommandTrigger bind:open class="ml-auto w-48 shrink md:w-72" />

<CommandDialog bind:open title="Search" description="Find a page or a component.">
  <CommandInput placeholder="Search the docs…" />
  <CommandList>
    <CommandEmpty>Nothing matches.</CommandEmpty>
    {#each groups as group (group.section)}
      <CommandGroup heading={group.section}>
        {#each group.pages as entry (entry.href)}
          <CommandItem
            value="{group.section} {entry.title} {entry.description ?? ''}"
            onSelect={() => go(entry.href)}
          >
            {entry.title}
          </CommandItem>
        {/each}
      </CommandGroup>
    {/each}
  </CommandList>
</CommandDialog>
