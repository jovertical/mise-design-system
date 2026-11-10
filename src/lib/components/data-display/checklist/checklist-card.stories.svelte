<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'

  import StoryAxis from '../../../../../stories/story-axis.svelte'
  import ChecklistCard from './checklist-card.svelte'
  import type { ChecklistCardItem } from './checklist-types.js'

  const STEPS: ChecklistCardItem[] = [
    { id: 'location', label: 'Add a location', done: false },
    { id: 'products', label: 'Add your first product', done: false },
    { id: 'staff', label: 'Invite a teammate', done: false },
    { id: 'sale', label: 'Record a sale', done: false },
  ]

  const done = (ids: string[]) => STEPS.map((step) => ({ ...step, done: ids.includes(step.id) }))

  const { Story } = defineMeta({
    title: 'Data display/Checklist/Card',
    component: ChecklistCard,
    tags: ['mise'],
    args: { title: 'Get started', percent: 50, items: done(['location', 'products']) },
    argTypes: {
      size: { control: 'inline-radio', options: ['sm', 'md'] },
      variant: { control: 'inline-radio', options: ['default', 'outline'] },
    },
  })
</script>

<script lang="ts">
  const WITH_ACTIONS: ChecklistCardItem[] = $derived([
    { id: 'location', label: 'Add a location', done: true },
    { id: 'products', label: 'Add your first product', done: false, action: start },
    { id: 'staff', label: 'Invite a teammate', done: false, action: start },
    { id: 'sale', label: 'Record a sale', done: false },
  ])
</script>

{#snippet seeAll()}
  <a href="#getting-started" class="text-primary text-xs hover:underline">See all steps</a>
{/snippet}
{#snippet start()}
  <a href="#start" class="text-primary hover:underline">Start</a>
{/snippet}

<!--
  A progress card small enough to live above a sidebar's nav: a ring, a
  heading, and the next few unmet rows. The percentage is the caller's, since
  the card shows the next few rows and the ring counts all of them.
-->
<Story name="Playground">
  {#snippet template(args)}
    <div class="w-64"><ChecklistCard {...args} footer={seeAll} /></div>
  {/snippet}
</Story>

<!--
  `sm` for a card pinned above a sidebar's nav: the ring, the title, the rows
  and the card's own padding scale together.
-->
<Story name="Sizes" asChild>
  <StoryAxis values={['md', 'sm'] as const} orientation="vertical">
    {#snippet item(size)}
      <div class="w-64">
        <ChecklistCard
          title="Get started"
          percent={25}
          {size}
          items={done(['location'])}
          footer={seeAll}
        />
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  `outline` drops the fill and the shadow for a visible ring: on a dark
  sidebar a dark fill barely reads as a card, and a border separates it.
-->
<Story name="Variants" asChild>
  <StoryAxis values={['default', 'outline'] as const} orientation="vertical">
    {#snippet item(variant)}
      <div class="bg-sidebar text-sidebar-foreground w-64 rounded-xl p-3">
        <ChecklistCard
          title="Get started"
          percent={25}
          size="sm"
          {variant}
          items={done(['location'])}
          footer={seeAll}
        />
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!--
  Nothing started, part way, and done. An untouched row is a dashed ring, not
  a warning; the ring turns `success` only at the finish line.
-->
<Story name="States" asChild>
  <StoryAxis values={['empty', 'partial', 'complete'] as const} orientation="vertical">
    {#snippet item(state)}
      <div class="w-64">
        <ChecklistCard
          title="Get started"
          percent={{ empty: 0, partial: 50, complete: 100 }[state]}
          items={{
            empty: STEPS,
            partial: done(['location', 'products']),
            complete: done(['location', 'products', 'staff', 'sale']),
          }[state]}
          footer={seeAll}
        />
      </div>
    {/snippet}
  </StoryAxis>
</Story>

<!-- An action at the end of an unmet row: "Start", pointing at where the step is done. -->
<Story name="With actions" asChild>
  <div class="w-64">
    <ChecklistCard title="Get started" percent={25} items={WITH_ACTIONS} footer={seeAll} />
  </div>
</Story>

<!--
  The sidebar's icon rail: no card, a solid icon at a nav icon's width, the
  share in its accessible name. At 0% a bare ring would read as nothing.
-->
<Story name="In an icon rail" asChild>
  <div
    class="bg-sidebar text-sidebar-foreground flex w-14 flex-col items-center gap-3 rounded-xl px-2 py-3"
  >
    <ChecklistCard collapsed title="Get started" percent={0} items={STEPS} />
    <ChecklistCard collapsed title="Get started" percent={50} items={done(['location', 'sale'])} />
    <ChecklistCard
      collapsed
      title="Get started"
      percent={100}
      items={done(['location', 'products', 'staff', 'sale'])}
    />
  </div>
</Story>

<!-- No way to the full list, for a card that is the whole list. -->
<Story name="Without footer" asChild>
  <div class="w-64">
    <ChecklistCard title="Get started" percent={50} items={done(['location', 'products'])} />
  </div>
</Story>

<!--
  99.6% prints 100% while the ring keeps its gap and its unfinished colour, and
  a long step name truncates, readable whole on hover.
-->
<Story name="Fractional and long label" asChild>
  <div class="w-64">
    <ChecklistCard
      title="Get started"
      percent={99.6}
      items={[
        ...done(['location', 'products', 'staff']).slice(0, 3),
        {
          id: 'sale',
          label: 'Record your first sale on the register and print a receipt',
          done: false,
        },
      ]}
      footer={seeAll}
    />
  </div>
</Story>

<!-- No rows: the list region is dropped rather than drawn empty. -->
<Story name="No items" asChild>
  <div class="w-64">
    <ChecklistCard title="Get started" percent={100} items={[]} footer={seeAll} />
  </div>
</Story>
