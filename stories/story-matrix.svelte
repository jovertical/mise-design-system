<!--
  Story scaffolding, not a package export: two axes of a component crossed, with
  the column labels across the top and the row labels down the side.
-->
<script lang="ts" generics="Row extends string, Column extends string">
  import type { Snippet } from 'svelte'

  let {
    rows,
    columns,
    cell,
  }: {
    rows: readonly Row[]
    columns: readonly Column[]
    cell: Snippet<[Row, Column]>
  } = $props()
</script>

<div
  class="grid items-center justify-start gap-x-4 gap-y-3"
  style:grid-template-columns="auto repeat({columns.length}, auto)"
>
  <span></span>
  {#each columns as column (column)}
    <span class="text-muted-foreground text-xs">{column}</span>
  {/each}
  {#each rows as row (row)}
    <span class="text-muted-foreground text-xs">{row}</span>
    {#each columns as column (column)}
      <div>{@render cell(row, column)}</div>
    {/each}
  {/each}
</div>
