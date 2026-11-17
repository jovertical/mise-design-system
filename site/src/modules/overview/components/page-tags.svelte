<!--
  A component page's tags in the rail: the release it arrived in, then its
  origin, New and its traits, each leading to the overview filtered by it.
  Nothing for a page that is not a component.
-->
<script lang="ts">
  import { Text } from '@jovertical/mise-design-system'

  import { resolve } from '$app/paths'
  import { page } from '$app/state'

  import { entryAt } from '../data/site-entries.js'
  import EntryTags from './entry-tags.svelte'

  /** The page's href as the entries know it: without the Pages base path. */
  const href = $derived.by(() => {
    const base = resolve('/').replace(/\/$/, '')

    return page.url.pathname.slice(base.length).replace(/\/$/, '') || '/'
  })

  const entry = $derived(entryAt(href))
</script>

{#if entry}
  <section aria-label="Tags" class="mb-8">
    <Text as="p" size="sm" weight="medium">Tags</Text>
    <Text as="p" size="sm" muted class="mt-1">
      {entry.since ? `Since ${entry.since}` : 'Unreleased'}
    </Text>
    <div class="mt-3"><EntryTags {entry} linked /></div>
  </section>
{/if}
