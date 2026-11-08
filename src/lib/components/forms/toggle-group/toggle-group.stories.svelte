<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'

  import ToggleGroup from './toggle-group.svelte'
  import ToggleGroupItem from './toggle-group-item.svelte'

  const { Story } = defineMeta({
    title: 'Forms/ToggleGroup',
    component: ToggleGroup,
    tags: ['shadcn'],
  })
</script>

<!--
  Mutually exclusive options as a washed, rounded track with a lifted pill: the
  same shape as `Tabs`. This is the default choice for any preset picker, such as
  multipliers, time ranges, view switches or kind filters. Reach for `outline`
  only when the group must read as buttons rather than a filter.
-->
<!--
  The props are a union keyed on `type`, which Storybook's untyped `args` cannot
  be spread across; `as object` lets the controls through without the check.
-->
<Story name="Playground">
  {#snippet template(args)}
    <ToggleGroup
      type="single"
      variant="segmented"
      value="1"
      aria-label="Multiplier"
      {...args as object}
    >
      <ToggleGroupItem value="1">1x</ToggleGroupItem>
      <ToggleGroupItem value="1.5">1.5x</ToggleGroupItem>
      <ToggleGroupItem value="2">2x</ToggleGroupItem>
      <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
    </ToggleGroup>
  {/snippet}
</Story>

<!--
  `segmented`, the default choice, is a washed track with a lifted pill: the same
  shape as `Tabs`. `outline` is the upstream shape, a row of buttons sharing one
  border with corners squared where they meet. It reads as one joined control
  rather than a filter, closer to a toolbar of actions than a set of options.
-->
<Story name="Variants" asChild>
  <StoryAxis values={['segmented', 'outline'] as const} orientation="vertical">
    {#snippet item(variant)}
      <ToggleGroup type="single" {variant} value="left" aria-label="Alignment, {variant}">
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
      </ToggleGroup>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `size` only takes effect on the segmented track: `sm` and `lg` resize the
  track's height and the item's padding and text. Leave it unset unless a call
  site has a reason to sit level with a smaller or larger control beside it.
-->
<Story name="Sizes" asChild>
  <StoryAxis values={['sm', 'default', 'lg'] as const} orientation="vertical">
    {#snippet item(size)}
      <ToggleGroup
        type="single"
        variant="segmented"
        size={size === 'default' ? undefined : size}
        value="1"
        aria-label="Multiplier, {size}"
      >
        <ToggleGroupItem value="1">1x</ToggleGroupItem>
        <ToggleGroupItem value="1.5">1.5x</ToggleGroupItem>
        <ToggleGroupItem value="2">2x</ToggleGroupItem>
      </ToggleGroup>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  Square, icon-only cells rather than the segmented default's `flex-1 px-3`
  pill. Each option drops to `size-6 flex-none px-0`, so a lone glyph does not
  read as a button missing its label.
-->
<Story name="Icon only" asChild>
  <ToggleGroup type="single" variant="segmented" value="table" aria-label="View">
    <ToggleGroupItem value="table" aria-label="Table view" class="size-6 flex-none px-0">
      <span class="text-xs">▤</span>
    </ToggleGroupItem>
    <ToggleGroupItem value="grid" aria-label="Grid view" class="size-6 flex-none px-0">
      <span class="text-xs">▦</span>
    </ToggleGroupItem>
  </ToggleGroup>
</Story>
