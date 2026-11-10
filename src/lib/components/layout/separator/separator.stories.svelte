<script module lang="ts">
  // The React package has no Separator stories; these show its orientations.
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Separator from './separator.svelte'

  const { Story } = defineMeta({
    title: 'Layout/Separator',
    component: Separator,
    tags: ['shadcn'],
  })
</script>

<Story name="Playground">
  {#snippet template(args)}
    <div class="bg-card grid max-w-sm gap-3 rounded-xl p-4 text-sm ring-1 ring-foreground/5">
      <p class="font-medium">Morning shift</p>
      <Separator {...args} />
      <p class="text-muted-foreground">12 orders, 3 late.</p>
    </div>
  {/snippet}
</Story>

<!--
  `horizontal`, the default, rules between stacked blocks. `vertical` stands
  between items in a row, and takes the row's height.
-->
<Story name="Orientations" asChild>
  <StoryAxis values={['horizontal', 'vertical'] as const} orientation="vertical">
    {#snippet item(orientation)}
      {#if orientation === 'horizontal'}
        <div class="bg-card grid max-w-sm gap-3 rounded-xl p-4 text-sm ring-1 ring-foreground/5">
          <p class="font-medium">Morning shift</p>
          <Separator />
          <p class="text-muted-foreground">12 orders, 3 late.</p>
        </div>
      {:else}
        <div
          class="bg-card flex h-8 items-center gap-3 rounded-xl px-4 text-sm ring-1 ring-foreground/5"
        >
          <span>Orders</span>
          <Separator orientation="vertical" />
          <span>Stock</span>
          <Separator orientation="vertical" />
          <span>Shifts</span>
        </div>
      {/if}
    {/snippet}
  </StoryAxis>
</Story>

<!--
  A short divider between groups in a toolbar: `class="h-4"` sets a vertical
  rule's height; without one it stretches to its row.
-->
<Story name="In a toolbar" asChild>
  <div class="bg-card flex h-12 items-center gap-2 rounded-xl border px-3 text-sm">
    <span class="font-medium">Orders</span>
    <Separator orientation="vertical" class="h-4" />
    <span class="text-muted-foreground">North depot</span>
    <Separator orientation="vertical" class="h-4" />
    <span class="text-muted-foreground">Today</span>
  </div>
</Story>
