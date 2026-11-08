<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Sparkline from './sparkline.svelte'

  const CLIMBING = [180, 210, 240, 260, 300, 320, 335, 340]
  const FALLING = [340, 320, 290, 300, 260, 230, 210, 180]

  const { Story } = defineMeta({
    title: 'Data display/Sparkline',
    component: Sparkline,
    tags: ['mise'],
    args: { data: CLIMBING, tone: 'primary', height: 40, 'aria-label': 'Sales, climbing' },
    argTypes: {
      tone: { control: 'select', options: TONES },
      height: { control: { type: 'range', min: 24, max: 96 } },
    },
  })
</script>

<!--
  The width comes from whatever holds the sparkline, so it is given one here;
  in a tile it gets half the row.
-->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Sparkline {...args} class="w-64" /></OnACard>
  {/snippet}
</Story>

<!-- Every tone but neutral, which a series never wants: it would read as disabled. -->
<Story name="Tones" asChild>
  <OnACard>
    <StoryAxis values={TONES.filter((tone) => tone !== 'neutral')} orientation="vertical">
      {#snippet item(tone)}
        <Sparkline data={CLIMBING} {tone} class="w-64" aria-label="{tone} series, climbing" />
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  The tone says nothing about direction. A falling line in green is a fall in a
  thing that is good; colouring it red is the tile's job, not the sparkline's.
-->
<Story name="Direction" asChild>
  <OnACard>
    <StoryAxis values={['climbing', 'falling'] as const}>
      {#snippet item(direction)}
        <Sparkline
          data={direction === 'climbing' ? CLIMBING : FALLING}
          tone="success"
          class="w-48"
          aria-label="Sales, {direction}"
        />
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!-- Fewer than two points draws nothing, rather than a dot or a flat rule. -->
<Story name="Not enough data" asChild>
  <OnACard>
    <div class="w-64">
      <Sparkline data={[42]} />
      <p class="text-muted-foreground text-xs">Nothing renders above this line.</p>
    </div>
  </OnACard>
</Story>
