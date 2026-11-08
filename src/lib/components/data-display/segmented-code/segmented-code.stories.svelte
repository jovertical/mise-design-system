<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import SegmentedCode from './segmented-code.svelte'

  const KEY_GROUPS = [5, 4, 4, 4, 4, 4, 4]

  const { Story } = defineMeta({
    title: 'Data display/SegmentedCode',
    component: SegmentedCode,
    tags: ['mise'],
    parameters: { layout: 'centered' },
    args: { value: '66G6D-ME7021KJ6JBFN82MAWQA9VCV', groups: KEY_GROUPS, size: 'md' },
    argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  })
</script>

<!-- A device licence key: 5, then six 4s. -->
<Story name="Playground">
  {#snippet template(args)}
    <SegmentedCode {...args} />
  {/snippet}
</Story>

<!-- `sm` beside other controls; `lg` for a code read across a counter. -->
<Story name="Sizes" asChild>
  <StoryAxis values={['sm', 'md', 'lg'] as const} orientation="vertical">
    {#snippet item(size)}
      <SegmentedCode value="66G6D-ME7021KJ6JBFN82MAWQA9VCV" groups={KEY_GROUPS} {size} />
    {/snippet}
  </StoryAxis>
</Story>

<!-- A pairing code: six boxes of one, as a device's pair screen asks for it. -->
<Story name="Pairing code" asChild>
  <SegmentedCode value="K7Q2XD" groups={[1, 1, 1, 1, 1, 1]} size="lg" />
</Story>
