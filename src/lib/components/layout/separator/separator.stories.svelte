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
