<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import Card from '../../layout/card/card.svelte'
  import CardContent from '../../layout/card/card-content.svelte'
  import CardHeader from '../../layout/card/card-header.svelte'
  import CardTitle from '../../layout/card/card-title.svelte'
  import SegmentedBar, { type Segment } from './segmented-bar.svelte'

  const stockStatus: Segment[] = [
    { label: 'Adequate', value: 412, tone: 'success' },
    { label: 'Low', value: 63, tone: 'warning' },
    { label: 'Out of stock', value: 18, tone: 'critical' },
    { label: 'Untracked', value: 96, tone: 'neutral' },
  ]

  const { Story } = defineMeta({
    title: 'Data display/SegmentedBar',
    component: SegmentedBar,
    tags: ['mise'],
    args: { segments: stockStatus },
    argTypes: {
      size: { control: 'inline-radio', options: ['sm', 'md'] },
      showShare: { control: 'boolean' },
      showLabels: { control: 'boolean' },
    },
  })
</script>

<!--
  A catalogue split by stock status. One bar rather than four, because the
  question is how the total divides.
-->
<Story name="Playground">
  {#snippet template(args)}
    <Card class="max-w-3xl">
      <CardHeader><CardTitle>Stock status</CardTitle></CardHeader>
      <CardContent><SegmentedBar {...args} /></CardContent>
    </Card>
  {/snippet}
</Story>

<!--
  `md`, the dashboard bar, carries captions and shares. `sm` is a rule at
  table-row scale, and drops both because at 8px they have nowhere to go.
-->
<Story name="Sizes" asChild>
  <Card class="max-w-3xl">
    <CardContent>
      <StoryAxis values={['md', 'sm'] as const} orientation="vertical">
        {#snippet item(size)}
          <SegmentedBar segments={stockStatus} {size} />
        {/snippet}
      </StoryAxis>
    </CardContent>
  </Card>
</Story>

<!-- Nothing counted yet draws an empty track rather than dividing by zero. -->
<Story name="States" asChild>
  <Card class="max-w-3xl">
    <CardContent>
      <SegmentedBar segments={[{ label: 'Adequate', value: 0 }]} />
    </CardContent>
  </Card>
</Story>

<!--
  The same data at table-row scale. In a cell the exact figures are the columns
  either side, so the bar only shows the proportion.
-->
<Story name="In a table row" asChild>
  <Card class="max-w-md">
    <CardContent stack="md">
      {#each [
        { name: 'Main', available: 280, reserved: 92, transit: 40 },
        { name: 'Warehouse', available: 18, reserved: 0, transit: 120 },
      ] as row (row.name)}
        <div class="flex items-center gap-6">
          <span class="w-32 text-sm font-medium">{row.name}</span>
          <SegmentedBar
            class="w-24"
            size="sm"
            segments={[
              { label: 'Available', value: row.available, tone: 'primary' },
              { label: 'Reserved', value: row.reserved, tone: 'warning' },
              { label: 'In transit', value: row.transit, tone: 'neutral' },
            ]}
          />
        </div>
      {/each}
    </CardContent>
  </Card>
</Story>

<!--
  A share too narrow to hold its percentage drops the text rather than shrinking
  or spilling it. The caption still names the segment.
-->
<Story name="Narrow segments" asChild>
  <Card class="max-w-3xl">
    <CardContent>
      <SegmentedBar
        segments={[
          { label: 'Active', value: 240, tone: 'primary' },
          { label: 'Suspended', value: 9, tone: 'warning' },
          { label: 'Recovery pending', value: 3, tone: 'critical' },
          { label: 'Revoked', value: 2, tone: 'neutral' },
        ]}
      />
    </CardContent>
  </Card>
</Story>

<!--
  No captions or shares, for a bar heading a list that carries the same names
  underneath: repeating them on one card is noise.
-->
<Story name="Bare" asChild>
  <Card class="max-w-3xl">
    <CardContent>
      <SegmentedBar segments={stockStatus} showLabels={false} showShare={false} />
    </CardContent>
  </Card>
</Story>
