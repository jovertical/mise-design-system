<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryMatrix from '../../../../../stories/story-matrix.svelte'
  import { TONES, type Tone } from '../../../utils/tone.js'
  import Badge from './badge.svelte'
  import type { BadgeVariant } from './badge-variants.js'

  const VARIANTS: BadgeVariant[] = ['soft', 'solid', 'outline']

  const ORDER_STATUS_TONE: Record<'open' | 'preparing' | 'ready' | 'late' | 'cancelled', Tone> = {
    open: 'neutral',
    preparing: 'info',
    ready: 'success',
    late: 'warning',
    cancelled: 'critical',
  }

  const { Story } = defineMeta({
    title: 'Data display/Badge',
    component: Badge,
    tags: ['shadcn'],
    argTypes: {
      variant: { control: 'inline-radio', options: VARIANTS },
      tone: { control: 'select', options: TONES },
    },
  })
</script>

<!-- Every prop, for poking at in the controls panel. -->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard><Badge {...args}>Badge</Badge></OnACard>
  {/snippet}
</Story>

<!--
  The whole set: three treatments × six tones. Badges are `rounded-lg` (8px),
  the tightest radius in the system, because a badge is a label on something
  else rather than a surface of its own.

  The neutral column is regular weight and the toned columns are medium. A
  neutral badge is a label on a row, and weight is for a state.
-->
<Story name="Matrix" asChild>
  <OnACard>
    <StoryMatrix rows={VARIANTS} columns={TONES}>
      {#snippet cell(variant, tone)}
        <Badge {variant} {tone}>{tone === 'neutral' ? 'Draft' : 'Active'}</Badge>
      {/snippet}
    </StoryMatrix>
  </OnACard>
</Story>

<!--
  `count` for a number on its own: a nav row's unread tally, a count beside a
  tab. A count is `h-5 min-w-5 rounded-full`, so one digit is a circle and two
  or three stretch it into a pill of the same height. Figures are tabular, so a
  count that ticks from 8 to 9 does not shift.

  A count with a word in it ("3 items") is a label, not a count. Leave the prop
  off.
-->
<Story name="Count" asChild>
  <OnACard>
    <div class="flex flex-col gap-3">
      {#each ['primary', 'warning', 'critical', 'neutral'] as const as tone}
        <div class="flex items-center gap-3">
          {#each [3, 12, '99+'] as value}
            <Badge count {tone}>{value}</Badge>
          {/each}
          <Badge count variant="solid" {tone}>7</Badge>
        </div>
      {/each}
    </div>
  </OnACard>
</Story>

<!--
  `soft` is the default answer for a status: a state something is in. A page
  header full of solid fills reads as a row of buttons.
-->
<Story name="Statuses" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-2">
      <Badge>Draft</Badge>
      <Badge tone="info">Scheduled</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">On hold</Badge>
      <Badge tone="critical">Cancelled</Badge>
    </div>
  </OnACard>
</Story>

<!--
  `outline` is a tag: metadata the reader may want, not a state to act on, such
  as a unit, a category or a channel. It stays neutral almost always; a coloured
  outline is a status that did not commit to being one.
-->
<Story name="Tags" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-2">
      <Badge variant="outline">kg</Badge>
      <Badge variant="outline">Dry goods</Badge>
      <Badge variant="outline">Walk-in</Badge>
      <Badge variant="outline">Counter</Badge>
    </div>
  </OnACard>
</Story>

<!--
  `solid` shouts. Keep it for a status that has to interrupt, such as out of
  stock on a sellable item or a failed sync. A column of solid badges in a table
  says nothing louder than a column of soft ones; it says everything equally
  loud.
-->
<Story name="Solid" asChild>
  <OnACard>
    <div class="flex items-center gap-3">
      <span class="font-heading text-sm">Cold brew concentrate</span>
      <Badge variant="solid" tone="critical">Out of stock</Badge>
    </div>
  </OnACard>
</Story>

<!--
  How a domain status reaches a badge: a `Record<Status, Tone>` beside the type,
  not a map of variant names. The treatment is the screen's decision, so it stays
  at the call site; the map only answers "what state is this".
-->
<Story name="From a domain status" asChild>
  <OnACard>
    <div class="flex flex-wrap items-center gap-2">
      {#each Object.entries(ORDER_STATUS_TONE) as [status, tone]}
        <Badge {tone} class="capitalize">{status}</Badge>
      {/each}
    </div>
  </OnACard>
</Story>
