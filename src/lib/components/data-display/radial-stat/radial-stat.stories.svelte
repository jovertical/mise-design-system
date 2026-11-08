<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import RadialStat from './radial-stat.svelte'

  const { Story } = defineMeta({
    title: 'Data display/RadialStat',
    component: RadialStat,
    tags: ['mise'],
    args: { percent: 64 },
    argTypes: {
      percent: { control: { type: 'range', min: 0, max: 100 } },
      diameter: { control: { type: 'range', min: 36, max: 160 } },
      tone: { control: 'select', options: TONES },
      thickness: { control: 'inline-radio', options: ['regular', 'thick'] },
    },
  })

  const health = [
    {
      label: 'Adequate',
      description: 'At or above the reorder point',
      percent: 70,
      count: 412,
      tone: 'success',
    },
    {
      label: 'Low',
      description: 'Below the reorder point, still sellable',
      percent: 11,
      count: 63,
      tone: 'warning',
    },
    {
      label: 'Out of stock',
      description: 'Nothing on hand at any location',
      percent: 3,
      count: 18,
      tone: 'critical',
    },
    {
      label: 'Untracked',
      description: 'Stock is not counted for these',
      percent: 16,
      count: 96,
      tone: 'neutral',
    },
  ] as const
</script>

<!-- Every prop, for the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><RadialStat {...args} /></OnACard>
  {/snippet}
</Story>

<!--
  The stroke scales with the diameter, so a small ring stays legible rather than
  becoming a hairline.
-->
<Story name="Sizes" asChild>
  <OnACard>
    <StoryAxis values={['48', '72', '120'] as const}>
      {#snippet item(diameter)}
        <RadialStat percent={40} diameter={Number(diameter)} />
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!-- Every tone, at the default 72px. -->
<Story name="Tones" asChild>
  <OnACard>
    <StoryAxis values={TONES}>
      {#snippet item(tone)}
        <RadialStat percent={72} {tone} />
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  `regular` is a ring around a figure, right where several sit in a column and
  labels carry the meaning. `thick` has the weight to be a card's subject, where
  the thin ring reads as an outline around empty space. At 48px `thick` stays
  legible where `regular` is already at its 4px floor.
-->
<Story name="Thicknesses" asChild>
  <OnACard>
    <StoryAxis values={['regular', 'thick'] as const}>
      {#snippet item(thickness)}
        <div class="flex items-end gap-4">
          <RadialStat percent={64} diameter={140} tone="success" {thickness}>
            <div class="text-center">
              <div class="font-heading text-2xl font-semibold tabular-nums">64%</div>
              <div class="text-muted-foreground text-xs">received</div>
            </div>
          </RadialStat>
          <RadialStat percent={64} diameter={48} {thickness} />
        </div>
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  A handful of parts, each with its own ring. Four is readable; twenty would be
  a wall of dials, which is the line between this and `MetricBar`.
-->
<Story name="In a list" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>Stock health</CardTitle></CardHeader>
    <CardContent stack="md">
      {#each health as row (row.label)}
        <div class="flex items-center gap-4">
          <RadialStat
            percent={row.percent}
            tone={row.tone}
            aria-label="{row.label}: {row.percent}%"
          />
          <div class="min-w-0 flex-1">
            <p class="font-heading text-base font-medium">{row.label}</p>
            <p class="text-muted-foreground text-sm">{row.description}</p>
          </div>
          <span
            class="bg-muted grid size-10 shrink-0 place-items-center rounded-xl text-sm tabular-nums"
          >
            {row.count}
          </span>
        </div>
      {/each}
    </CardContent>
  </Card>
</Story>

<!--
  `children` replaces the printed percentage when the interesting figure is a
  count.
-->
<Story name="A count inside" asChild>
  <OnACard>
    <RadialStat percent={40} diameter={120} tone="success">
      <span class="text-2xl font-semibold">18</span>
    </RadialStat>
  </OnACard>
</Story>

<!--
  The small shares, where a ring is hardest to draw. Round caps on an arc
  shorter than the stroke overrun it, so below that length the cap squares off:
  these degrade to a thin arc and then to an empty track. The threshold is the
  stroke width, so a thick ring needs a larger share before it rounds.
-->
<Story name="Small shares" asChild>
  <OnACard>
    <div class="flex flex-col gap-4">
      {#each ['regular', 'thick'] as const as thickness (thickness)}
        <div class="flex flex-wrap items-center gap-4">
          {#each [0, 1, 2, 8] as percent (percent)}
            <RadialStat {percent} diameter={140} {thickness} />
          {/each}
        </div>
      {/each}
    </div>
  </OnACard>
</Story>

<!-- Both ends, and a share over 100 clamped to a full ring. -->
<Story name="Bounds" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-4">
      <RadialStat percent={0} />
      <RadialStat percent={100} tone="success" />
      <RadialStat percent={140} tone="critical" />
    </div>
  </OnACard>
</Story>
