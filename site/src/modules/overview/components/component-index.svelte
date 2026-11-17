<!--
  The components overview: a query, the tag chips, then every component by
  section and sub-group. The chips mirror the URL's `?tag=`, read once the page
  has loaded (a prerendered page cannot read its query) and written back as
  they change, so a page's badge links here filtered.
-->
<script lang="ts">
  import {
    Button,
    EmptyState,
    Heading,
    Input,
    ToggleGroup,
    ToggleGroupItem,
  } from '@jovertical/mise-design-system'
  import IconFilterOff from '@tabler/icons-svelte-runes/icons/filter-off'
  import { untrack } from 'svelte'

  import { slugOf } from '#modules/docs/utils/anchors.js'
  import { replaceState } from '$app/navigation'
  import { page } from '$app/state'

  import { sectionsOf } from '../data/entries.js'
  import { siteEntries } from '../data/site-entries.js'
  import { FILTER_TAGS, filterEntries, tagsFrom } from '../utils/filter.js'
  import ComponentTable from './component-table.svelte'

  let query = $state('')
  let tags: string[] = $state([])
  let loaded = $state(false)

  const sections = $derived(sectionsOf(filterEntries(siteEntries(), query, tags)))

  $effect(() => {
    tags = untrack(() => tagsFrom(page.url.searchParams))

    loaded = true
  })

  $effect(() => {
    if (!loaded) return

    const params = new URLSearchParams(tags.map((tag) => ['tag', tag]))
    const search = params.size > 0 ? `?${params}`.replace(/\+/g, '%20') : ''

    untrack(() => replaceState(`${page.url.pathname}${search}`, page.state))
  })

  function clear() {
    query = ''

    tags = []
  }
</script>

{#snippet filterIcon()}
  <IconFilterOff />
{/snippet}

{#snippet clearAction()}
  <Button variant="outline" onclick={clear}>Clear filters</Button>
{/snippet}

<div class="not-prose mt-6 flex flex-col gap-3">
  <Input
    bind:value={query}
    placeholder="Filter by name, description or keyword…"
    aria-label="Filter components"
    class="max-w-sm"
  />
  <ToggleGroup
    type="multiple"
    variant="outline"
    size="sm"
    bind:value={tags}
    aria-label="Filter by tag"
    class="flex-wrap"
  >
    {#each FILTER_TAGS as tag (tag)}
      <ToggleGroupItem value={tag}>{tag === 'new' ? 'New' : tag}</ToggleGroupItem>
    {/each}
  </ToggleGroup>
</div>

{#each sections as section (section.section)}
  <Heading as="h2" size="lg" id={slugOf(section.section)} class="mt-10 mb-3"
    >{section.section}</Heading
  >
  {#each section.groups as group (group.group ?? section.section)}
    {#if group.group}
      <Heading as="h3" size="sm" class="text-muted-foreground mt-6 mb-2">{group.group}</Heading>
    {/if}
    <ComponentTable entries={group.entries} />
  {/each}
{:else}
  <div class="mt-10">
    <EmptyState
      icon={filterIcon}
      title="No components match"
      description="Try fewer tags or another word."
      actions={clearAction}
    />
  </div>
{/each}
