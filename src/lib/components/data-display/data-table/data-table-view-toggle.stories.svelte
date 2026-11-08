<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import DataTableViewToggle from './data-table-view-toggle.svelte'
  import type { DataTableViewMode } from './features.js'

  const { Story } = defineMeta({
    title: 'Data display/DataTable/ViewToggle',
    component: DataTableViewToggle,
    tags: ['mise'],
  })

  const view = $state<{ mode: DataTableViewMode }>({ mode: 'table' })
</script>

<!--
  A segmented control of two glyphs. It owns nothing: the page holds the mode
  and binds it to both this and the table. Show it only on a listing that draws
  cards; a grid view that renders nothing is worse than no toggle.
-->
<Story name="Playground" asChild>
  <div class="flex items-center gap-4">
    <DataTableViewToggle bind:value={view.mode} />
    <span class="text-muted-foreground text-sm">{view.mode} view</span>
  </div>
</Story>
