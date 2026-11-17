<!--
  A component's tags as badges: its origin, New when it is, then its traits.
  With `linked`, each badge leads to the overview filtered by it.
-->
<script lang="ts">
  import { Badge } from '@jovertical/mise-design-system'

  import { resolve } from '$app/paths'

  import type { ComponentEntry } from '../data/entries.js'
  import { overviewHref } from '../utils/filter.js'

  let { entry, linked = false }: { entry: ComponentEntry; linked?: boolean } = $props()

  const hrefFor = (tag: string) => (linked ? resolve(overviewHref(tag) as '/') : undefined)
</script>

<span class="flex flex-wrap gap-1">
  <Badge href={hrefFor(entry.origin)}>{entry.origin}</Badge>
  {#if entry.isNew}
    <Badge tone="info" href={hrefFor('new')}>New</Badge>
  {/if}
  {#each entry.traits as trait (trait)}
    <Badge variant="outline" href={hrefFor(trait)}>{trait}</Badge>
  {/each}
</span>
