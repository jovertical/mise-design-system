<!--
  `ChecklistCard`: a ring, a heading and the next few rows, small enough to sit
  above a sidebar's nav. The share is the caller's, since the card shows a few
  rows and the ring counts all of them. `sm` and `outline` are for a dark
  sidebar, where a dark fill barely reads as a card.
-->
<script lang="ts">
  import { ChecklistCard, type ChecklistCardItem } from '@jovertical/mise-design-system'

  const items: ChecklistCardItem[] = $derived([
    { id: 'location', label: 'Add a location', done: true },
    { id: 'stock', label: 'Count opening stock', done: false, action: start },
    { id: 'invite', label: 'Invite a teammate', done: false, action: start },
    { id: 'sale', label: 'Record a sale', done: false },
  ])
</script>

{#snippet start()}
  <a href="#/getting-started" class="text-primary hover:underline">Start</a>
{/snippet}

{#snippet seeAll()}
  <a href="#/getting-started" class="text-primary text-xs hover:underline">See all steps</a>
{/snippet}

<div class="flex flex-wrap items-start gap-6">
  <div class="w-64">
    <ChecklistCard title="Get started" percent={25} {items} footer={seeAll} />
  </div>
  <div class="bg-sidebar text-sidebar-foreground w-64 rounded-xl p-3">
    <ChecklistCard
      title="Get started"
      percent={25}
      size="sm"
      variant="outline"
      {items}
      footer={seeAll}
    />
  </div>
</div>
