<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconMinus from '@tabler/icons-svelte-runes/icons/minus'
  import IconPlus from '@tabler/icons-svelte-runes/icons/plus'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Button from '../../actions/button/button.svelte'
  import Input from '../input/input.svelte'
  import ButtonGroup from './button-group.svelte'
  import ButtonGroupSeparator from './button-group-separator.svelte'
  import ButtonGroupText from './button-group-text.svelte'

  const { Story } = defineMeta({
    title: 'Forms/ButtonGroup',
    component: ButtonGroup,
    tags: ['shadcn'],
    argTypes: {
      orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    },
  })
</script>

<!--
  Adjacent buttons share one edge instead of each carrying its own radius and
  gap.
-->
<Story name="Playground">
  {#snippet template(args)}
    <ButtonGroup {...args}>
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<!--
  Horizontal joins along a row; vertical stacks, for a short list of actions
  on one record. Neighbours overlap by a pixel, and a toned button sits above
  them, so Delete's critical outline stays whole on the side it shares.
-->
<Story name="Orientations" asChild>
  <StoryAxis values={['horizontal', 'vertical'] as const}>
    {#snippet item(orientation)}
      <ButtonGroup {orientation} class={orientation === 'vertical' ? 'w-32' : undefined}>
        <Button variant="outline">Edit</Button>
        <Button variant="outline">Duplicate</Button>
        <Button variant="outline" tone="critical">Delete</Button>
      </ButtonGroup>
    {/snippet}
  </StoryAxis>
</Story>

<!-- A stepper: two buttons and the input they act on, read as one control. -->
<Story name="With input" asChild>
  <ButtonGroup>
    <Button variant="outline" iconOnly aria-label="Decrease"><IconMinus class="size-4" /></Button>
    <Input class="w-16 rounded-none text-center" value="4" />
    <Button variant="outline" iconOnly aria-label="Increase"><IconPlus class="size-4" /></Button>
  </ButtonGroup>
</Story>

<!-- `ButtonGroupText` and `ButtonGroupSeparator` for a fixed label ahead of an action. -->
<Story name="With text" asChild>
  <ButtonGroup>
    <ButtonGroupText>$</ButtonGroupText>
    <ButtonGroupSeparator />
    <Input class="w-24 rounded-l-none" value="799.00" />
  </ButtonGroup>
</Story>
