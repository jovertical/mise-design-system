<!-- One run of the overview: a sub-group's components, or a whole section's. -->
<script lang="ts">
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@jovertical/mise-design-system'

  import { resolve } from '$app/paths'

  import type { ComponentEntry } from '../data/entries.js'
  import EntryTags from './entry-tags.svelte'

  let { entries }: { entries: ComponentEntry[] } = $props()
</script>

<Table class="table-fixed">
  <TableHeader>
    <TableRow>
      <TableHead class="w-44">Component</TableHead>
      <TableHead>Description</TableHead>
      <TableHead class="w-64">Tags</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {#each entries as entry (entry.href)}
      <TableRow>
        <TableCell class="font-medium">
          <a href={resolve(entry.href as '/')} class="text-primary hover:underline"
            >{entry.title}</a
          >
        </TableCell>
        <TableCell class="text-muted-foreground whitespace-normal">{entry.description}</TableCell>
        <TableCell class="whitespace-normal"><EntryTags {entry} /></TableCell>
      </TableRow>
    {/each}
  </TableBody>
</Table>
