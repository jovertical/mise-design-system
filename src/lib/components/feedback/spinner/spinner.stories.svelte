<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import Spinner from './spinner.svelte'

  const { Story } = defineMeta({
    title: 'Feedback/Spinner',
    component: Spinner,
    tags: ['shadcn'],
  })
</script>

<!--
  `role="status"` and an `aria-label`, unlike a hand-spun icon: reach for this
  rather than a spinning loader glyph, which is silent to a screen reader.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Spinner {...args} />
  {/snippet}
</Story>

<!-- `size-4` by default. Size it with a class, to the text or the control it sits in. -->
<Story name="Sizes" asChild>
  <StoryAxis values={['size-3.5', 'size-4', 'size-6'] as const}>
    {#snippet item(size)}
      <Spinner class={size} />
    {/snippet}
  </StoryAxis>
</Story>

<!--
  A caption names what is being waited on, and the status announces it.
  "Loading…" alone tells the operator nothing the spinner does not.
-->
<Story name="With caption" asChild>
  <div class="flex flex-col gap-3">
    <Spinner>Loading locations…</Spinner>
    <Spinner>Setting up the first location…</Spinner>
  </div>
</Story>
