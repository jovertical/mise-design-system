<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Text from './text.svelte'

  const WEIGHTS = ['normal', 'medium', 'semibold'] as const

  const { Story } = defineMeta({
    title: 'Typography/Text',
    component: Text,
    tags: ['mise'],
    argTypes: {
      as: { control: 'inline-radio', options: ['span', 'p', 'div'] },
      size: { control: 'inline-radio', options: [undefined, 'xs', 'sm'] },
      tone: { control: 'select', options: [undefined, ...TONES] },
      weight: { control: 'inline-radio', options: [undefined, ...WEIGHTS] },
    },
  })
</script>

<!-- Every prop, for the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Text {...args}>Last synced 2 minutes ago</Text></OnACard>
  {/snippet}
</Story>

<!-- The three weights. Body text is `normal`; weight is for a name, a value or a total. -->
<Story name="Weights" asChild>
  <OnACard>
    <StoryAxis values={WEIGHTS} orientation="vertical">
      {#snippet item(weight)}
        <Text {weight}>Espresso beans, 1 kg</Text>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  `tone` for text that carries a state: the error line under a field is
  `tone="critical"`, a low-stock note `tone="warning"`. It wins over `muted`.
-->
<Story name="Tones" asChild>
  <OnACard>
    <StoryAxis values={TONES} orientation="vertical">
      {#snippet item(tone)}
        <Text size="sm" {tone}>On-hand updated at Riverside.</Text>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!-- `truncate` needs a width to cut against: here the `max-w-48` wrapper. -->
<Story name="Long content" asChild>
  <OnACard>
    <div class="max-w-48">
      <Text as="div" size="sm" weight="medium" truncate>
        Single origin cold brew concentrate, 1 litre, unsweetened
      </Text>
    </div>
  </OnACard>
</Story>

<!-- A name, a value and a total: `medium` for the first two, `semibold` for the last. -->
<Story name="Line items and a total" asChild>
  <OnACard>
    <div class="flex max-w-sm flex-col gap-1 text-sm">
      <div class="flex justify-between gap-4">
        <Text weight="medium">Espresso beans, 1 kg</Text>
        <Text numeric>$12.50</Text>
      </div>
      <div class="flex justify-between gap-4">
        <Text weight="medium">Oat milk, 1 L</Text>
        <Text numeric>$1.85</Text>
      </div>
      <div class="flex justify-between gap-4 border-t pt-1">
        <Text weight="semibold">Total</Text>
        <Text weight="semibold" numeric>$14.35</Text>
      </div>
    </div>
  </OnACard>
</Story>

<!-- The three most common pieces of styled text, by name. -->
<Story name="The common three" asChild>
  <OnACard>
    <div class="flex max-w-sm flex-col gap-3 text-sm">
      <Text as="p" size="sm" muted
        >Stock counts from the last cycle count, per location. (`size="sm" muted`)</Text
      >
      <Text as="p" size="xs" muted>Updated 16 Jul 2026 by Ana Cruz. (`size="xs" muted`)</Text>
      <p>Riverside <Text muted>· 4 staff</Text>: bare `muted` inherits the line's size.</p>
    </div>
  </OnACard>
</Story>
