<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import Skeleton from './skeleton.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/Skeleton',
    component: Skeleton,
    tags: ['shadcn'],
  })
</script>

<!--
  Shaped to what it stands in for: there is no default size. Reach for it bare
  where the package has not already drawn the loading shape for you.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Skeleton class="h-4 w-32" {...args} />
  {/snippet}
</Story>

<!-- Several skeletons standing in for a card that is still loading: an avatar, two lines, a paragraph. -->
<Story name="In a card" asChild>
  <div class="flex flex-col gap-3 rounded-xl border p-4">
    <div class="flex items-center gap-3">
      <Skeleton class="size-10 shrink-0 rounded-full" />
      <div class="flex flex-col gap-1.5">
        <Skeleton class="h-4 w-32" />
        <Skeleton class="h-3 w-20" />
      </div>
    </div>
    <Skeleton class="h-3 w-full" />
    <Skeleton class="h-3 w-4/5" />
  </div>
</Story>
