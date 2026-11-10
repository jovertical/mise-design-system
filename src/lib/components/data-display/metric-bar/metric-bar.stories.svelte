<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import IconBuildingStore from '@tabler/icons-svelte-runes/icons/building-store'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import { TONES } from '../../../utils/tone.js'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import MetricBar from './metric-bar.svelte'

  const { Story } = defineMeta({
    title: 'Data display/MetricBar',
    component: MetricBar,
    tags: ['mise'],
    args: { label: 'Active', value: '589', percent: 76 },
    argTypes: {
      percent: { control: { type: 'range', min: 0, max: 100 } },
      tone: { control: 'select', options: TONES },
    },
  })

  const locations = [
    { name: 'Riverside', where: 'North district · 566 items', used: 398, cap: 500 },
    { name: 'Harbour', where: 'Waterfront · 554 items', used: 321, cap: 500 },
    { name: 'North yard', where: 'Industrial park · 530 items', used: 321, cap: 700 },
  ]

  const coverage = [
    { rank: 1, label: 'Riverside', percent: 96, stocked: 566 },
    { rank: 2, label: 'Harbour', percent: 94, stocked: 554 },
    { rank: 3, label: 'North yard', percent: 93, stocked: 548 },
    { rank: 4, label: 'Market street', percent: 90, stocked: 530 },
    { rank: 5, label: 'Airport kiosk', percent: 86, stocked: 507 },
  ]
</script>

<!-- One measure, stated and then drawn. -->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-md">
      <CardContent><MetricBar {...args} /></CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  Tone colours the fill and nothing else, and is worth spending only where the
  operator should act. A list where every bar is red says no more than a list
  where none is.
-->
<Story name="Tones" asChild>
  <Card class="max-w-md">
    <CardContent>
      <StoryAxis values={TONES} orientation="vertical">
        {#snippet item(tone)}
          <MetricBar label="Duplicate SKU" value="33%" percent={33} {tone} />
        {/snippet}
      </StoryAxis>
    </CardContent>
  </Card>
</Story>

<!--
  A `description` under the label and a capacity figure on the bar's line.
  `icon` draws a chip before the label: what the row is about.
-->
<Story name="With context" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>Stock by location</CardTitle></CardHeader>
    <CardContent stack="md">
      {#each locations as row (row.name)}
        {#snippet icon()}
          <IconBuildingStore />
        {/snippet}
        <MetricBar
          {icon}
          label={row.name}
          description={row.where}
          value="{Math.round((row.used / row.cap) * 100)}%"
          percent={(row.used / row.cap) * 100}
          trailing="{row.used} / {row.cap} units"
        />
      {/each}
    </CardContent>
  </Card>
</Story>

<!--
  `rank` numbers the row. The list is ordered by the figure, and numbering it
  says so rather than leaving the reader to infer it.
-->
<Story name="With rank" asChild>
  <Card class="max-w-md">
    <CardHeader><CardTitle>Catalogue coverage by location</CardTitle></CardHeader>
    <CardContent stack="md">
      {#each coverage as row (row.label)}
        {#snippet value()}
          <span class="text-foreground font-semibold">{row.percent}%</span>
        {/snippet}
        <MetricBar
          rank={row.rank}
          label={row.label}
          {value}
          percent={row.percent}
          trailing="{row.stocked} items stocked"
        />
      {/each}
    </CardContent>
  </Card>
</Story>

<!--
  The status list: a count on the label's line and a bar for its share of the
  whole. Rows are read by scanning the bars; the figures are there for whoever
  wants the exact answer.
-->
<Story name="By status" asChild>
  <Card class="max-w-2xl">
    <CardHeader><CardTitle>Items by status</CardTitle></CardHeader>
    <CardContent stack="md">
      <MetricBar label="Active" value="589" percent={76} />
      <MetricBar label="Discontinued" value="112" percent={14} />
      <MetricBar label="Inactive" value="41" percent={5} />
      <MetricBar label="Draft" value="34" percent={4} />
    </CardContent>
  </Card>
</Story>

<!-- The bar clamps rather than overflowing. Anything over 100 is a bug upstream. -->
<Story name="Clamped" asChild>
  <Card class="max-w-md">
    <CardContent stack="md">
      <MetricBar label="Reported" value="140%" percent={140} />
      <MetricBar label="Empty" value="0%" percent={0} />
    </CardContent>
  </Card>
</Story>
