<script module lang="ts">
  import ClipboardCheckIcon from '@lucide/svelte/icons/clipboard-check'
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import OnACard from '../../../../../stories/on-a-card.svelte'
  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import AsideCard from '../../layout/aside-card/aside-card.svelte'
  import ReadinessChecklist from './readiness.svelte'
  import type { ReadinessItem } from './readiness-summarise.js'
  import ReadinessSummary from './readiness-summary.svelte'

  const PRODUCT: ReadinessItem[] = [
    { id: 'name', label: 'Name', status: 'met' },
    {
      id: 'price',
      label: 'Selling price',
      status: 'unmet',
      detail: 'Set a price before it can go on sale.',
    },
    { id: 'category', label: 'Category', status: 'met' },
    { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
    { id: 'tax', label: 'Tax code', status: 'not-applicable' },
  ]
  const PROVISIONING: ReadinessItem[] = [
    { id: 'db', label: 'Database created', status: 'met' },
    { id: 'seed', label: 'Initial data loaded', status: 'pending' },
    { id: 'registers', label: 'Registers paired', status: 'unmet' },
  ]
  const DONE: ReadinessItem[] = [
    { id: 'name', label: 'Name', status: 'met' },
    { id: 'price', label: 'Selling price', status: 'met' },
    { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
  ]

  const { Story } = defineMeta({
    title: 'Data display/Readiness',
    component: ReadinessChecklist,
    tags: ['mise'],
    args: { items: PRODUCT },
  })
</script>

{#snippet clipboard()}
  <ClipboardCheckIcon />
{/snippet}

<!--
  One row per requirement, answering "what does this page still need from me".
  A missing required row is a warning dot and tagged Required; a met row needs
  no tag. Not-applicable rows are dropped rather than greyed.
-->
<Story name="Playground">
  {#snippet template(args)}
    <OnACard
      ><div class="w-80">
        <ReadinessChecklist {...args} items={args.items ?? PRODUCT} />
      </div></OnACard
    >
  {/snippet}
</Story>

<!-- A row in flight spins rather than warning; and nothing applicable says so. -->
<Story name="States" asChild>
  <StoryAxis values={['pending', 'empty'] as const} orientation="vertical">
    {#snippet item(state)}
      <OnACard>
        <div class="w-80">
          <ReadinessChecklist items={state === 'pending' ? PROVISIONING : []} />
        </div>
      </OnACard>
    {/snippet}
  </StoryAxis>
</Story>

<!-- In place: the summary and the list in an AsideCard beside the form they gate. -->
<Story name="In an aside" asChild>
  <div class="w-80">
    <AsideCard icon={clipboard} title="Ready to sell">
      <div class="flex flex-col gap-4">
        <ReadinessSummary items={PRODUCT} />
        <ReadinessChecklist items={PRODUCT} />
      </div>
    </AsideCard>
  </div>
</Story>

<!--
  A skipped optional and a missing required are both unticked and are not the
  same news: only the second shuts the gate, so only it is a warning.
-->
<Story name="Optional versus required" asChild>
  <OnACard>
    <div class="w-80">
      <ReadinessChecklist
        items={[
          { id: 'price', label: 'Selling price', status: 'unmet' },
          { id: 'photo', label: 'Photo', status: 'unmet', optional: true },
        ]}
      />
    </div>
  </OnACard>
</Story>

<!--
  `showRequirement={false}` for a progress list: what a server is doing, where
  a queued step tagged Required in warning colour would read as a problem.
-->
<Story name="Progress without requirement tags" asChild>
  <OnACard
    ><div class="w-80">
      <ReadinessChecklist items={PROVISIONING} showRequirement={false} />
    </div></OnACard
  >
</Story>

<!--
  The summary from the count alone: optional rows move the bar without holding
  the door, so it reads ready short of 100%.
-->
<Story name="Summary derived" asChild>
  <OnACard>
    <div class="flex w-80 flex-col gap-6">
      <ReadinessSummary items={PRODUCT} />
      <ReadinessSummary items={DONE} />
    </div>
  </OnACard>
</Story>

<!--
  `ready` where a server owns the gate. False with every row ticked means the
  gate is shut for a reason this list does not know, and it says "Not ready
  yet" rather than claiming otherwise.
-->
<Story name="Summary server override" asChild>
  <OnACard>
    <div class="w-80">
      <ReadinessSummary items={DONE.filter((item) => item.status === 'met')} ready={false} />
    </div>
  </OnACard>
</Story>
