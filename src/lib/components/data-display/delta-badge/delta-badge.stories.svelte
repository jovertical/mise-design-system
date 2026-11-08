<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import DeltaBadge from './delta-badge.svelte'

  const { Story } = defineMeta({
    title: 'Data display/DeltaBadge',
    component: DeltaBadge,
    tags: ['mise'],
    args: { value: 6.4 },
    argTypes: {
      variant: { control: 'inline-radio', options: ['pill', 'plain'] },
      invert: { control: 'boolean' },
    },
  })
</script>

<!-- Every prop, for the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><DeltaBadge {...args} /></OnACard>
  {/snippet}
</Story>

<!--
  `pill` is self-contained, for beside a bare figure. `plain` drops the fill and
  reads as part of a sentence: one muted line rather than a coloured badge
  against grey text.
-->
<Story name="Variants" asChild>
  <OnACard>
    <StoryAxis values={['pill', 'plain'] as const} orientation="vertical">
      {#snippet item(variant)}
        {#if variant === 'pill'}
          <DeltaBadge value={-0.6} unit=" pt" invert />
        {:else}
          <span class="text-muted-foreground inline-flex items-center gap-1 text-xs">
            <DeltaBadge value={-0.6} unit=" pt" invert variant="plain" />
            vs 5 Feb – 29 Apr 2026
          </span>
        {/if}
      {/snippet}
    </StoryAxis>
  </OnACard>
</Story>

<!--
  Colour reads the sign. Most figures on a dashboard are things you want more
  of, so up is green; zero is flat and muted.
-->
<Story name="Directions" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-3">
      <DeltaBadge value={6.4} />
      <DeltaBadge value={-2.8} />
      <DeltaBadge value={0} />
    </div>
  </OnACard>
</Story>

<!--
  A metric where falling is the point: failed payments, time to fulfil, stock
  at risk. The arrow still follows the sign; only the colour flips.
-->
<Story name="Inverted" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-3">
      <DeltaBadge value={-2.8} invert />
      <DeltaBadge value={6.4} invert />
    </div>
  </OnACard>
</Story>

<!-- `unit` covers multiples as well as rates: turnover moves in `x`, not `%`. -->
<Story name="Units" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-3">
      <DeltaBadge value={15.7} />
      <DeltaBadge value={0.7} unit="x" />
      <DeltaBadge value={12} precision={0} />
    </div>
  </OnACard>
</Story>

<!--
  A change in money. `prefix` puts the symbol after the sign, `+$1.25`, and
  `unit` is emptied so the `%` default does not trail it.
-->
<Story name="Currency prefix" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-3">
      <DeltaBadge value={1.25} prefix="$" unit="" precision={2} />
      <DeltaBadge value={-1.4} prefix="$" unit="" precision={2} />
      <DeltaBadge value={0} prefix="$" unit="" precision={2} />
    </div>
  </OnACard>
</Story>
