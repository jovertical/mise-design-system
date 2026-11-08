<!--
  Story scaffolding, not a package export: one prop's values side by side, each
  labelled. Vertical puts the label to the left, for items too wide to sit in a
  row.
-->
<script lang="ts" generics="Value extends string">
  import type { Snippet } from 'svelte'

  let {
    values,
    item,
    orientation = 'horizontal',
  }: {
    values: readonly Value[]
    item: Snippet<[Value]>
    orientation?: 'horizontal' | 'vertical'
  } = $props()
</script>

{#if orientation === 'vertical'}
  <div class="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-3">
    {#each values as value (value)}
      <span class="text-muted-foreground text-xs">{value}</span>
      <div>{@render item(value)}</div>
    {/each}
  </div>
{:else}
  <div class="flex flex-wrap items-end gap-6">
    {#each values as value (value)}
      <div class="flex flex-col items-center gap-2">
        {@render item(value)}
        <span class="text-muted-foreground text-xs">{value}</span>
      </div>
    {/each}
  </div>
{/if}
