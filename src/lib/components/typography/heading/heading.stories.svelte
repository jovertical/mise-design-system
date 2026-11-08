<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Text from '../text/text.svelte'
  import Heading from './heading.svelte'

  const { Story } = defineMeta({
    title: 'Typography/Heading',
    component: Heading,
    tags: ['mise'],
    argTypes: {
      as: { control: 'inline-radio', options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    },
  })
</script>

<!-- Every prop, for the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <Heading {...args}>Purchasing</Heading>
  {/snippet}
</Story>

<!--
  The three steps, each one the package already draws somewhere: `sm` is a card's
  title, `md` a dialog's, `lg` a section opening a page body.
-->
<Story name="Sizes" asChild>
  <StoryAxis values={['lg', 'md', 'sm'] as const} orientation="vertical">
    {#snippet item(size)}
      <Heading {size}>Purchasing</Heading>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  A section inside a page body, the job this exists for: a heading and the line
  under it, above a group of cards. `as` follows the outline; `size` follows the
  weight the section should carry.
-->
<Story name="Section opening" asChild>
  <div class="flex max-w-lg flex-col gap-1">
    <Heading as="h2" size="lg">Packs and suppliers</Heading>
    <Text as="p" size="sm" muted
      >How this item is bought: each pack, who sells it, and what it costs.</Text
    >
  </div>
</Story>
